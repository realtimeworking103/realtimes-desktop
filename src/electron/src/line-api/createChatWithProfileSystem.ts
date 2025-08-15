import http2 from "http2";
import fs from "fs";
import path from "path";
import { encodeGroupName, encodeMid } from "./function.js";
import db from "../services/sqliteService.js";
import { lineconfig } from "../config/line-config.js";
import { acquireEncryptedAccessToken } from "../line/acquireEncryptedAccessToken.js";
import { updateProfileDefault } from "../line/updateProfileDefault.js";

export async function createChatWithProfileSystem({
  accessToken,
  nameGroup,
  ldName,
  midAdmin,
}: {
  accessToken: string;
  nameGroup: string;
  ldName: string;
  midAdmin: string[];
}) {
  const token = accessToken.split(":")[0];
  const contactFolderPath = path.join(process.cwd(), "ContactMids");
  const usedFolderPath = path.join(process.cwd(), "GroupMids");
  const contactFilePath = path.join(contactFolderPath, `${token}.txt`);
  const usedPath = path.join(usedFolderPath, `${token}.txt`);
  const MAX_PER_GROUP = 99;
  const adminMids = midAdmin;

  if (!fs.existsSync(usedFolderPath)) {
    fs.mkdirSync(usedFolderPath, { recursive: true });
  }

  const chunkArray = (arr: string[], size: number) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size),
    );

  const contactMids = fs.existsSync(contactFilePath)
    ? fs
        .readFileSync(contactFilePath, "utf-8")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
    : [];

  const usedMids: string[] = fs.existsSync(usedPath)
    ? fs
        .readFileSync(usedPath, "utf-8")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
    : [];

  const newMids = contactMids.filter((m) => !usedMids.includes(m));
  if (newMids.length < 10) {
    console.log(
      `ไม่เพียงพอ mid: มี ${newMids.length} mid แต่ต้องการอย่างน้อย 10 mid`,
    );
    return;
  }

  // คำนวณจำนวน mid ที่สามารถใส่ในแต่ละกลุ่มได้ (หัก admin mid ออก)
  const availableSlotsPerGroup = MAX_PER_GROUP - adminMids.length;
  if (availableSlotsPerGroup <= 0) {
    console.log(`Admin mid เกิน ${MAX_PER_GROUP} mid ไม่สามารถสร้างกลุ่มได้`);
    return;
  }

  // แบ่งกลุ่มโดยคำนึงถึง admin mid
  const groups = chunkArray(newMids, availableSlotsPerGroup);

  let successCount = 0;
  let totalProcessedMids: string[] = [];

  for (let i = 0; i < groups.length; i++) {
    const midsInGroup = [...adminMids, ...groups[i]];
    const groupNameBuf = encodeGroupName(nameGroup);
    const countBuf = encodeMid(midsInGroup.length.toString());
    const midsBuf = encodeMid(midsInGroup.join(","));
    const payload = Buffer.concat([
      Buffer.from([
        0x82, 0x21, 0x01, 0x0a, 0x63, 0x72, 0x65, 0x61, 0x74, 0x65, 0x43, 0x68,
        0x61, 0x74, 0x1c, 0x15, 0x92, 0x4e,
      ]),
      groupNameBuf,
      countBuf,
      midsBuf,
      Buffer.from([0x18, 0x00, 0x00, 0x00]),
    ]);

    const result = await new Promise<boolean>((resolve, reject) => {
      try {
        const client = http2.connect(lineconfig.LINE_HOST_DOMAIN);

        const req = client.request({
          ":method": "POST",
          ":path": "/S4",
          "User-Agent": "Line/13.1.0",
          "X-Line-Access": accessToken,
          "X-Line-Application": "ANDROID\t13.1.0\tAndroid OS\t9",
          "X-Lal": "th_TH",
          "X-Lpv": "1",
          "Content-Type": "application/x-thrift",
          "Accept-Encoding": "gzip, deflate, br",
        });

        let body = "";
        req.on("data", (chunk) => {
          console.log(`Response Body CreateChat :`, chunk.toString());
          body += chunk.toString();
        });

        req.on("end", async () => {
          try {
            client.close();
            const groupId = body.slice(21, 54);
            if (body.toLowerCase().includes("request blocked")) {
              console.log(`กลุ่มที่ ${i + 1} สร้างไม่สำเร็จ: request blocked`);
              resolve(false);
            } else {
              const acquireToken =
                await acquireEncryptedAccessToken(accessToken);
              updateProfileDefault(groupId, acquireToken);
              // เพิ่มเฉพาะ mid ที่ใช้จริงในการสร้างกลุ่มสำเร็จ
              totalProcessedMids.push(...groups[i]);
              resolve(true);
            }
          } catch (err) {
            console.error("Error creating group:", err);
            reject(err);
          }
        });

        req.write(payload);
        req.end();
      } catch (error) {
        console.error("Error creating group:", error);
        reject(error);
      }
    });

    if (result) {
      successCount++;
      console.log(`สร้างกลุ่มที่ ${i + 1} สำเร็จ (${midsInGroup.length} mid)`);
    }
  }

  // อัปเดต used mids เฉพาะที่ใช้จริง
  if (totalProcessedMids.length > 0) {
    usedMids.push(...totalProcessedMids);
    fs.writeFileSync(usedPath, usedMids.join("\n") + "\n");
  }

  // อัปเดตสถานะสุดท้ายหลังจากสร้างกลุ่มทั้งหมดเสร็จ
  if (successCount > 0) {
    const row = db
      .prepare(`SELECT GroupGridLD FROM GridLD WHERE LDPlayerGridLD = ?`)
      .get(ldName) as { GroupGridLD: string };

    const currentCount = parseInt(row?.GroupGridLD || "0", 10);
    const newCount = currentCount + successCount;

    db.prepare(
      `UPDATE GridLD SET StatusAccGridLD = ?, StatusGridLD = ?, GroupGridLD = ? WHERE LDPlayerGridLD = ?`,
    ).run(
      `สร้างกลุ่มสำเร็จ`,
      `สร้างกลุ่มสำเร็จ${successCount}/${groups.length}กลุ่ม`,
      newCount.toString(),
      ldName,
    );
  } else {
    // อัปเดตสถานะเมื่อสร้างกลุ่มไม่สำเร็จ
    db.prepare(
      `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
    ).run(`สร้างกลุ่มไม่สำเร็จ`, ldName);
  }
}

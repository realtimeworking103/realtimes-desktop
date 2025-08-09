import http2 from "http2";
import fs from "fs";
import path from "path";
import { encodeGroupName, encodeMid, getMidCountBytes } from "./function.js";
import { uploadImageWithHttps } from "./updateProfileGroup2.js";
import db from "../services/sqliteService.js";
import { lineconfig } from "../config/line-config.js";
import { acquireEncryptedAccessToken } from "./acquireEncryptedAccessToken.js";

export async function createChatWithProfileCustom({
  accessToken,
  nameGroup,
  ldName,
  profile,
  midAdmin,
}: {
  accessToken: string;
  nameGroup: string;
  ldName: string;
  profile: string;
  midAdmin: string[];
}) {
  const token = accessToken.split(":")[0];
  const contactFolderPath = path.join(process.cwd(), "ContactMids");
  const usedFolderPath = path.join(process.cwd(), "GroupMids");
  const contactFilePath = path.join(contactFolderPath, `${token}.txt`);
  const usedPath = path.join(usedFolderPath, `${token}.txt`);
  const MAX_PER_GROUP = 97;
  const userAgent = `Line/${lineconfig.LINE_VERSION[Math.floor(Math.random() * lineconfig.LINE_VERSION.length)]}`;
  const xLineApplication = `ANDROID\t${lineconfig.LINE_VERSION[Math.floor(Math.random() * lineconfig.LINE_VERSION.length)]}\tAndroid OS\t9`;

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

  const newMids = [
    ...new Set(contactMids.filter((m) => !usedMids.includes(m))),
  ];
  if (newMids.length < 10) {
    console.log(
      `Not enough mid: have ${newMids.length} mid but need at least 10 mid`,
    );
    return;
  }

  const availableSlotsPerGroup = MAX_PER_GROUP - midAdmin.length;
  if (availableSlotsPerGroup <= 0) {
    console.log(`Admin mid exceed ${MAX_PER_GROUP} mid cannot create group`);
    return;
  }

  const groups = chunkArray(newMids, availableSlotsPerGroup);

  let successCount = 0;
  let totalProcessedMids: string[] = [];

  for (let i = 0; i < groups.length; i++) {
    const midsInGroup = [...new Set([...midAdmin, ...groups[i]])];
    const groupNameBuf = encodeGroupName(nameGroup);
    const countBuf = getMidCountBytes(midsInGroup.length);
    const midsBuf = Buffer.concat(midsInGroup.map(encodeMid));
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
        const client = http2.connect(lineconfig.URL_LINE);

        const req = client.request({
          ":method": "POST",
          ":path": "/S4",
          "User-Agent": userAgent,
          "X-Line-Access": accessToken,
          "X-Line-Application": xLineApplication,
          "X-Lal": "th_TH",
          "X-Lpv": "1",
          "Content-Type": "application/x-thrift",
          // "Accept-Encoding": "gzip, deflate, br",
        });

        req.on("response", (headers) => {
          console.log("Response Headers:");
          for (const name in headers) {
            console.log(`${name}: ${headers[name]}`);
          }
        });

        let response = "";
        req.on("data", (chunk) => {
          response += chunk.toString();
          console.log(`Response Body CreateChat :`, response);
        });

        req.on("end", async () => {
          try {
            client.close();
            const groupId = response.slice(21, 54);
            if (response.toLowerCase().includes("request blocked")) {
              console.log(`Group ${i + 1} Create Failed: request blocked`);
              resolve(false);
            } else {
              const acquireToken =
                await acquireEncryptedAccessToken(accessToken);
              await uploadImageWithHttps({
                chatMid: groupId,
                acquireToken,
                profile,
              });
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
      console.log(`Group ${i + 1} Create Success (${midsInGroup.length} mid)`);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  if (totalProcessedMids.length > 0) {
    usedMids.push(...totalProcessedMids);
    const uniqueUsedMids = [...new Set(usedMids)];
    fs.writeFileSync(usedPath, uniqueUsedMids.join("\n") + "\n");
  }

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
    db.prepare(
      `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
    ).run(`สร้างกลุ่มไม่สำเร็จ`, ldName);
  }
}

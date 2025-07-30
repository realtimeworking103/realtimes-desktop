import http2 from "http2";
import fs from "fs";
import path from "path";

import { encodeGroupName, encodeMid, getMidCountBytes } from "./function.js";
import { uploadImageToGroup } from "./updateProfileGroup1.js";
import db from "../services/sqliteService.js";
import { lineconfig } from "../config/line-config.js";
import { acquireEncryptedAccessToken } from "./acquireEncryptedAccessToken.js";

const MAX_PER_GROUP = 99;
const chunkArray = (arr: string[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );

export async function createChatWithProfileSystem(params: {
  accessToken: string;
  nameGroup: string;
  ldName: string;
  contactFolder?: string;
  usedFolder?: string;
}) {
  const {
    accessToken,
    nameGroup,
    ldName,
    contactFolder = "ContactMids",
    usedFolder = "GroupMids",
  } = params;

  const token = accessToken.split(":")[0];

  const contactFolderPath = path.join(process.cwd(), contactFolder);
  const contactFilePath = path.join(contactFolderPath, `${token}.txt`);

  const contactMids = fs.existsSync(contactFilePath)
    ? fs
        .readFileSync(contactFilePath, "utf-8")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
    : [];

  const usedPath = path.join(process.cwd(), usedFolder, `${token}.txt`);
  if (!fs.existsSync(usedPath)) {
    fs.mkdirSync(path.dirname(usedPath), { recursive: true });
  }

  const usedMids: string[] = fs.existsSync(usedPath)
    ? fs
        .readFileSync(usedPath, "utf-8")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
    : [];

  const adminFilePath = path.join(process.cwd(), "admin.txt");
  const adminMids = fs.existsSync(adminFilePath)
    ? fs
        .readFileSync(adminFilePath, "utf-8")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
    : [];

  const newMids = contactMids.filter((m) => !usedMids.includes(m));
  if (newMids.length < 10) {
    db.prepare(
      `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
    ).run(`จำนวนเพื่อนต่ำกว่าที่กำหนด`, ldName);
    return;
  }

  const groups = chunkArray(newMids, MAX_PER_GROUP - adminMids.length);

  for (let i = 0; i < groups.length; i++) {
    const midsInGroup = [...adminMids, ...groups[i]];
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

    const client = http2.connect(lineconfig.URL_LINE);

    const req = client.request({
      ":method": "POST",
      ":path": "/S4",
      "User-Agent": "Line/15.2.1",
      "X-Line-Access": accessToken,
      "X-Line-Application": "ANDROID\t15.2.1\tAndroid OS\t9",
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
          db.prepare(
            `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
          ).run(`สร้างกลุ่มไม่สำเร็จ request blocked`, ldName);
        } else {
          const acquireToken = await acquireEncryptedAccessToken(accessToken);
          await uploadImageToGroup(groupId, acquireToken);

          usedMids.push(...midsInGroup);

          fs.writeFileSync(usedPath, usedMids.join("\n") + "\n");

          const row = db
            .prepare(`SELECT GroupGridLD FROM GridLD WHERE LDPlayerGridLD = ?`)
            .get(ldName) as { GroupGridLD: string };

          const currentCount = parseInt(row?.GroupGridLD || "0", 10);
          const newCount = currentCount + 1;

          db.prepare(
            `UPDATE GridLD SET StatusAccGridLD = ?, StatusGridLD = ?, GroupGridLD = ? WHERE LDPlayerGridLD = ?`,
          ).run(
            `สร้างกลุ่มสำเร็จ`,
            `สร้างกลุ่มสำเร็จ${groups.length}/${groups.length}กลุ่ม`,
            newCount.toString(),
            ldName,
          );
        }
      } catch (err) {
        console.error("Error creating group:", err);
      }
    });

    req.write(payload);
    req.end();
  }
}

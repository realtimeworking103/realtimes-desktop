import http2 from "http2";
import { encodeGroupName, encodeMid, getMidCountBytes } from "./function.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "../config-db.js";
import { acquireEncryptedAccessToken } from "./acquireEncryptedAccessToken.js";
import { createGroupImg } from "./createGroupImg.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_PER_GROUP = 99;
const chunkArray = (arr: string[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );

export async function createGroup(params: {
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

  const contactDir = path.join(__dirname, contactFolder);
  if (!fs.existsSync(contactDir)) {
    console.warn(`[createGroup] Create contact New: ${contactDir}`);
    fs.mkdirSync(contactDir, { recursive: true });
  }

  const sourcePath = path.join(__dirname, contactFolder, `${token}.txt`);
  if (!fs.existsSync(sourcePath)) {
    console.warn(`[createGroup] not found contact: ${sourcePath}`);
    fs.writeFileSync(sourcePath, "", "utf8");
  }

  const allMids = fs
    .readFileSync(sourcePath, "utf-8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l);

  const usedPath = path.join(__dirname, usedFolder, `${token}.txt`);
  let usedMids: string[] = [];
  if (fs.existsSync(usedPath)) {
    usedMids = fs
      .readFileSync(usedPath, "utf-8")
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l);
  }

  const newMids = allMids.filter((m) => !usedMids.includes(m));
  if (newMids.length === 0) {
    db.prepare(
      `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
    ).run(`จำนวนเพื่อนไม่พอ ${newMids.length}`, ldName);
    return;
  }

  const groups = chunkArray(newMids, MAX_PER_GROUP);

  for (let i = 0; i < groups.length; i++) {
    const midsInGroup = groups[i];
    const groupName = `${nameGroup}`;

    const header = Buffer.from([
      0x82, 0x21, 0x01, 0x0a, 0x63, 0x72, 0x65, 0x61, 0x74, 0x65, 0x43, 0x68,
      0x61, 0x74, 0x1c, 0x15, 0x92, 0x4e,
    ]);
    const groupNameBuf = encodeGroupName(groupName);
    const countBuf = getMidCountBytes(midsInGroup.length);
    const midsBuf = Buffer.concat(midsInGroup.map(encodeMid));
    const footer = Buffer.from([0x18, 0x00, 0x00, 0x00]);
    const payload = Buffer.concat([
      header,
      groupNameBuf,
      countBuf,
      midsBuf,
      footer,
    ]);

    await new Promise<void>((resolve, reject) => {
      const client = http2.connect("https://legy-backup.line-apps.com");

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

      req.on("response", (headers) => {
        console.log(`Group ${i + 1} response headers:`, headers);
      });

      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        try {
          const groupId = body.slice(21, 54);

          client.close();

          const tokenImg = await acquireEncryptedAccessToken(accessToken);
          await createGroupImg(groupId, tokenImg);

          if (!fs.existsSync(path.join(__dirname, usedFolder))) {
            fs.mkdirSync(path.join(__dirname, usedFolder), { recursive: true });
          }

          usedMids.push(...midsInGroup);
          fs.writeFileSync(usedPath, usedMids.join("\n") + "\n");

          db.prepare(
            `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
          ).run(
            `สร้างกลุ่มสำเร็จ${groups.length}/${groups.length}กลุ่ม`,
            ldName,
          );

          resolve();
        } catch (err) {
          reject(err);
        }
      });

      req.on("error", (err) => {
        console.error(`Group ${i + 1} error:`, err);
        client.close();
        reject(err);
      });

      req.write(payload);

      req.end();
    });
  }
}

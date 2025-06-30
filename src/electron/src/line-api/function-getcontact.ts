import http2 from "http2";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * ดึง list ของ MID ทั้งหมดจาก API แล้วเขียนลงไฟล์ <token>.txt
 * @param accessToken X-Line-Access token เต็มรูปแบบ
 * @param contactFolder โฟลเดอร์ที่จะเก็บไฟล์ MID (default: "ContactMids")
 * @returns อาร์เรย์ของ MID ที่อ่านเจอ
 */

export async function getContact(
  accessToken: string,
  contactFolder = "ContactMids",
): Promise<string[]> {
  const token = accessToken.split(":")[0];
  const contactDir = path.join(__dirname, contactFolder);
  if (!fs.existsSync(contactDir)) {
    fs.mkdirSync(contactDir, { recursive: true });
  }
  const filePath = path.join(contactDir, `${token}.txt`);

  const payload = Buffer.from([
    0x82, 0x21, 0x01, 0x10, 0x67, 0x65, 0x74, 0x41, 0x6c, 0x6c, 0x43, 0x6f,
    0x6e, 0x74, 0x61, 0x63, 0x74, 0x49, 0x64, 0x73, 0x15, 0x02, 0x00,
  ]);

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

  let body = "";
  return new Promise<string[]>((resolve, reject) => {
    req.on("data", (chunk) => {
      // console.log(`Response Body GetContact :`,chunk.toString());
      body += chunk.toString();
    });

    req.on("end", () => {
      client.close();

      const mids = body.match(/u[a-f0-9]{32}/gi) || [];
      if (mids.length) {
        fs.writeFileSync(filePath, mids.join("\n") + "\n", "utf8");
        console.log(`save ${mids.length} to File ${filePath}`);
      } else {
        console.log("not found response");
      }
      resolve(mids);
    });

    req.on("error", (err) => {
      client.close();
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

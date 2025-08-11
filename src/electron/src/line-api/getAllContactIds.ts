import http2 from "http2";
import fs from "fs";
import path from "path";
import { lineconfig } from "../config/line-config.js";

export async function getAllContactIds(accessToken: string): Promise<string[]> {
  const token = accessToken.split(":")[0];

  const contactDir = path.join(process.cwd(), "ContactMids");
  if (!fs.existsSync(contactDir)) {
    fs.mkdirSync(contactDir, { recursive: true });
  }

  const filePath = path.join(contactDir, `${token}.txt`);

  const payload = Buffer.from([
    0x82, 0x21, 0x01, 0x10, 0x67, 0x65, 0x74, 0x41, 0x6c, 0x6c, 0x43, 0x6f,
    0x6e, 0x74, 0x61, 0x63, 0x74, 0x49, 0x64, 0x73, 0x15, 0x02, 0x00,
  ]);

  return new Promise<string[]>((resolve, reject) => {
    try {
      const client = http2.connect(lineconfig.URL_LINE);

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
        body += chunk.toString();
      });

      req.on("end", () => {
        client.close();

        const allMids = body.match(/u[a-f0-9]{32}/gi) || [];
        if (allMids.length) {
          try {
            fs.writeFileSync(filePath, allMids.join("\n") + "\n", "utf8");
            console.log(`CONTACT IDS :`, allMids.length);
          } catch (error) {
            console.error("Error writing contact file:", error);
          }
        } else {
          console.log("NOT FOUND CONTACT IDS");
        }
        resolve(allMids);
      });

      req.on("error", (err) => {
        client.close();
        reject(err);
      });

      req.write(payload);
      req.end();
    } catch (error) {
      console.error("Error getting all contact ids:", error);
      reject([]);
    }
  });
}

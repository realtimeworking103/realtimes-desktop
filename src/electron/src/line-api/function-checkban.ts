import http2 from "http2";
import db from "../services/sqliteService.js";
import { lineconfig } from "../config/line-config.js";

export async function checkBanLdInstance({
  ldName,
  accessToken,
}: {
  ldName: string;
  accessToken: string;
}): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      const payload = Buffer.from([
        0x82, 0x21, 0x01, 0x0d, 0x69, 0x73, 0x73, 0x75, 0x65, 0x4c, 0x69, 0x66,
        0x66, 0x56, 0x69, 0x65, 0x77, 0x1c, 0x18, 0x13, 0x31, 0x33, 0x35, 0x39,
        0x33, 0x30, 0x31, 0x37, 0x31, 0x35, 0x2d, 0x4a, 0x4b, 0x64, 0x37, 0x59,
        0x37, 0x6a, 0x31, 0x1c, 0x1c, 0x00, 0x00, 0x2c, 0x11, 0x1c, 0x18, 0x24,
        0x61, 0x66, 0x35, 0x62, 0x32, 0x63, 0x64, 0x64, 0x2d, 0x38, 0x66, 0x63,
        0x65, 0x2d, 0x34, 0x30, 0x33, 0x37, 0x2d, 0x62, 0x65, 0x37, 0x39, 0x2d,
        0x63, 0x65, 0x32, 0x62, 0x32, 0x65, 0x30, 0x35, 0x30, 0x65, 0x39, 0x64,
        0x11, 0x00, 0x00, 0x22, 0x00, 0x00,
      ]);

      const client = http2.connect(lineconfig.LINE_HOST_DOMAIN);

      const req = client.request({
        ":method": "POST",
        ":path": "/LIFF1?X-Line-Liff-Id=1359301715-JKd7Y7j1",
        "x-line-liff-id": "1359301715-JKd7Y7j1",
        "User-Agent": "Line/13.1.0",
        Accept: "application/x-thrift",
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
        console.log(`Response Body CheckBan :`, chunk.toString());
      });

      req.on("end", async () => {
        const bodyText = body.toLowerCase();
        const isBanned =
          bodyText.includes("forbidden") ||
          bodyText.includes("failed to retrieve access token") ||
          bodyText.includes("access token refresh required");

        if (isBanned) {
          const stmt = db.prepare(
            `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
          );

          stmt.run("บัญชีโดนแบน", ldName);
        } else {
          const stmt = db.prepare(
            `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
          );

          stmt.run("บัญชีพร้อมใช้งาน", ldName);
        }
        resolve(true);
      });

      req.on("error", (err) => {
        client.close();
        reject(err);
      });

      req.write(payload);
      req.end();
    } catch (err) {
      console.error("CheckBanLdInstance Fail:", err);
      reject(err);
    }
  });
}

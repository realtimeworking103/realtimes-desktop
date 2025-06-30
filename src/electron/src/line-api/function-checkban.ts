import http2 from "http2";
import db from "../config-db.js";

export function checkBanLdInstance(params: {
  ldName: string;
  accessToken: string;
}): Promise<boolean> {
  const { accessToken, ldName } = params;

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

  return new Promise((resolve, reject) => {
    try {
      const client = http2.connect("https://legy-backup.line-apps.com");

      const req = client.request({
        ":method": "POST",
        ":path": "/LIFF1?X-Line-Liff-Id=1359301715-JKd7Y7j1",
        "x-line-liff-id": "1359301715-JKd7Y7j1",
        "User-Agent": "Line/15.2.1",
        Accept: "application/x-thrift",
        "X-Line-Access": accessToken,
        "X-Line-Application": "ANDROID\t15.2.1\tAndroid OS\t9",
        "X-Lal": "th_TH",
        "X-Lpv": "1",
        "Content-Type": "application/x-thrift",
        "Accept-Encoding": "gzip, deflate, br",
      });

      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
        console.log(`Response Body CheckBan :`,chunk.toString());
      });

      req.on("end", () => {
        client.close();

        const bodyText = body.toLowerCase();
        const isBanned =
          bodyText.includes("forbidden") ||
          bodyText.includes("failed to retrieve access token");

        const stmt = db.prepare(
          `UPDATE GridLD SET StatusAccGridLD = ?, StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
        );
        stmt.run(
          isBanned ? "บัญชีโดนแบน" : "บัญชีพร้อมใช้งาน",
          "ตรวจสอบข้อมูลเสร็จ",
          ldName,
        );

        resolve(true);
      });

      req.on("error", (err) => {
        client.close();
        reject(err);
      });

      req.write(payload);
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

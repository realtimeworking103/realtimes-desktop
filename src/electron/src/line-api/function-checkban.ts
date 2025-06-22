import http2 from "http2";
import db from "../config-db.js";

export function checkBanLdInstance(params: {
  ldName: string;
  accessToken: string;
}) {
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

  req.on("response", (headers) => {
    console.log("Response Headers:");
    for (const name in headers) {
      console.log(`${name}: ${headers[name]}`);
    }
  });

  let body = "";
  req.on("data", (chunk) => {
    console.log("Response body:", chunk.toString());
    body += chunk.toString();
  });

  req.on("end", () => {
    console.log("Request finished");
    client.close();

    const bodyText = body.toLowerCase();
    if (
      bodyText.includes("forbidden") ||
      bodyText.includes("failed to retrieve access token")
    ) {
      db.prepare(
        `UPDATE GridLD SET StatusAccGridLD = ?, StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
      ).run(`บัญชีโดนแบน`, `ตรวจสอบข้อมูลเสร็จ`, ldName);
    } else {
      db.prepare(
        `UPDATE GridLD SET StatusAccGridLD = ?, StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
      ).run(`บัญชีพร้อมใช้งาน`, `ตรวจสอบข้อมูลเสร็จ`, ldName);
    }
  });

  req.write(payload);

  req.end();
}

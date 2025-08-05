import http2 from "http2";
import { lineconfig } from "../config/line-config.js";

function createContactBuffer(index: number, phone: string): Buffer {
  const indexSizeByte = Math.floor(Math.log10(Math.abs(index))) + 1;
  const indexBytes = index
    .toString()
    .split("")
    .map((num) => parseInt(`0x3${num}`, 16));
  const numberBytes = Buffer.from(phone, "utf8");

  return Buffer.from([
    0x15,
    0x00,
    0x18,
    indexSizeByte,
    ...indexBytes,
    0x99,
    0x18,
    0x0c,
    ...numberBytes,
    0x19,
    0x08,
    0x00,
  ]);
}

function createContactBuffers(phones: string[]): Buffer {
  return Buffer.concat(
    phones.map((phone, idx) => createContactBuffer(idx + 1, phone)),
  );
}

export async function syncContactsKai(accessToken: string, phones: string[]) {
  return new Promise<string>((resolve, reject) => {
    try {
      const client = http2.connect(lineconfig.URL_LINE);

      const header = Buffer.from([
        0x82, 0x21, 0x01, 0x0c, 0x73, 0x79, 0x6e, 0x63, 0x43, 0x6f, 0x6e, 0x74,
        0x61, 0x63, 0x74, 0x73, 0x15, 0xf6, 0x2e, 0x19, 0xfc,
      ]);

      const footer = Buffer.from([0x00]);

      const countBuf = Buffer.from([phones.length]);
      const contactBuf = createContactBuffers(phones);
      const payload = Buffer.concat([header, countBuf, contactBuf, footer]);

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

      let response = "";
      req.on("data", (chunk) => {
        response += chunk.toString("utf8");
      });

      req.on("end", async () => {
        client.close();
        const midMatch = response.match(/u[a-f0-9]{32}/i);
        if (!midMatch) {
          return reject(new Error("ไม่พบ MID ใน response"));
        }
        const mid = midMatch[0];
        resolve(mid);
      });

      req.on("error", (err) => {
        client.close();
        console.error("Request error:", err);
        reject(err);
      });

      req.write(payload);
      req.end();
    } catch (error) {
      console.error("syncContactsKai error:", error);
      reject(error);
    }
  });
}

import http2 from "http2";
import { lineconfig } from "../config/line-config.js";
import { getContactsV2 } from "./getContactsV2.js";

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

      const countBuf = Buffer.from([phones.length]);
      const contactBuf = createContactBuffers(phones);
      const footer = Buffer.from([0x00]);
      const payload = Buffer.concat([header, countBuf, contactBuf, footer]);

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

      let chunks: Buffer[] = [];
      req.on("data", (c) => chunks.push(Buffer.from(c)));

      req.on("end", async () => {
        const buf = Buffer.concat(chunks);
        const response = buf.toString("utf8");
        const midMatch = response.match(/u[a-f0-9]{32}/i);
        client.close();
        if (!midMatch) {
          return reject(new Error(`เพิ่มเพื่อน ${phones} ไม่สำเร็จ`));
        }
        const mid = midMatch[0];
        getContactsV2({ accessToken, mid });
        resolve(mid);
      });

      req.on("error", (e) => {
        try {
          client.close();
        } catch {}
        reject(e);
      });
      req.write(payload);
      req.end();
    } catch (error) {
      console.error("syncContactsKai error:", error);
      reject(error);
    }
  });
}

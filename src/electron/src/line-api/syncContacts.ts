import http2 from "http2";
import { lineconfig } from "../config/line-config.js";

function createContactBuffer(index: number, phone: string): Buffer {
  const indexSizeByte = Math.floor(Math.log10(Math.abs(index))) + 1;
  const indexBytes = index
    .toString()
    .split("")
    .map((num) => parseInt(`0x3${num}`, 16));
  const numberBytes = Buffer.from(phone, "utf-8");

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

const header = Buffer.from([
  0x82, 0x21, 0x01, 0x0c, 0x73, 0x79, 0x6e, 0x63, 0x43, 0x6f, 0x6e, 0x74, 0x61,
  0x63, 0x74, 0x73, 0x15, 0xf6, 0x2e, 0x19, 0xfc,
]);

const footer = Buffer.from([0x00]);

export async function syncContacts(
  phones: string[],
  accessToken: string,
): Promise<number> {
  if (!phones || phones.length === 0) {
    return 0;
  }

  const validPhones = phones.filter(
    (phone) =>
      phone && phone.trim() !== "" && /^\d+$/.test(phone.replace(/\s/g, "")),
  );

  if (validPhones.length === 0) {
    return 0;
  }

  return new Promise((resolve, reject) => {
    const client = http2.connect(lineconfig.LINE_HOST_DOMAIN);

    const countBuf = Buffer.from([validPhones.length]);
    const contactBuf = createContactBuffers(validPhones);
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

    const chunks: Buffer[] = [];
    req.on("data", (chunk) => {
      chunks.push(chunk);
      console.log(chunk.toString("utf8"));
    });

    req.on("end", () => {
      client.close();
      const resBuffer = Buffer.concat(chunks);
      const resString = resBuffer.toString("utf8");
      const matches = resString.match(/\b\d{10,11}\b/g) || [];
      const unique = Array.from(new Set(matches));
      resolve(unique.length);
    });

    req.on("error", (err) => {
      client.close();
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

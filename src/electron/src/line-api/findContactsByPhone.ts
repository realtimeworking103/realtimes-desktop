import http2 from "http2";
import { lineconfig } from "../config/line-config.js";

function encodeFindContactPayload(phone: number): Buffer {
  const header = Buffer.from([
    0x82, 0x21, 0x01, 0x13, 0x66, 0x69, 0x6e, 0x64, 0x43, 0x6f, 0x6e, 0x74,
    0x61, 0x63, 0x74, 0x73, 0x42, 0x79, 0x50, 0x68, 0x6f, 0x6e, 0x65, 0x2a,
    0x18, 0x0d, 0x2b, 0x36, 0x36,
  ]);
  const phoneBuf = Buffer.from(phone.toString(), "utf8");
  const footer = Buffer.from([0x00]);
  return Buffer.concat([header, phoneBuf, footer]);
}

export async function findContactsByPhone({
  accessToken,
  phone,
}: {
  accessToken: string;
  phone: number;
}) {
  try {
    const payload = encodeFindContactPayload(phone);
    const client = http2.connect(lineconfig.LINE_HOST_DOMAIN);

    await new Promise<string>((resolve, reject) => {
      const req = client.request({
        ":method": "POST",
        ":path": "/S4",
        "User-Agent": "Line/13.1.0",
        "X-Line-Access": accessToken,
        "X-Line-Application": "ANDROID\t13.1.0\tAndroid OS\t9",
        "X-Lal": "th_TH",
        "X-Lpv": "1",
        "Content-Type": "application/x-thrift",
      });

      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        client.close();
        const mid = body.slice(43, 76);
        resolve(mid);
      });

      req.on("error", (error) => {
        reject(error);
      });

      req.write(payload);
      req.end();
    });
  } catch (error) {
    console.error(error);
    return "";
  }
}

export async function addFriendByMidPhone({
  accessToken,
  midPhone,
  phone,
}: {
  accessToken: string;
  midPhone: string;
  phone: string;
}) {
  return new Promise<void>((resolve, reject) => {
    try {
      const header = Buffer.from([
        0x82, 0x21, 0x01, 0x0e, 0x61, 0x64, 0x64, 0x46, 0x72, 0x69, 0x65, 0x6e,
        0x64, 0x42, 0x79, 0x4d, 0x69, 0x64, 0x1c, 0x15, 0xf4, 0x2e, 0x18, 0x21,
      ]);

      const midBuf = Buffer.from(midPhone, "utf8");

      const backmid = Buffer.from([
        0x1c, 0x18, 0x2f, 0x7b, 0x22, 0x73, 0x63, 0x72, 0x65, 0x65, 0x6e, 0x22,
        0x3a, 0x22, 0x66, 0x72, 0x69, 0x65, 0x6e, 0x64, 0x41, 0x64, 0x64, 0x3a,
        0x69, 0x64, 0x53, 0x65, 0x61, 0x72, 0x63, 0x68, 0x22, 0x2c, 0x22, 0x73,
        0x70, 0x65, 0x63, 0x22, 0x3a, 0x22, 0x6e, 0x61, 0x74, 0x69, 0x76, 0x65,
        0x22, 0x7d, 0x1c, 0x3c, 0x18,
      ]);

      const byteids = Buffer.from(phone.length.toString(), "utf8");
      const phonebuffer = Buffer.from(phone, "utf8");

      const footer = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00]);

      const client = http2.connect(lineconfig.LINE_HOST_DOMAIN);

      const payload = Buffer.concat([
        header,
        midBuf,
        backmid,
        byteids,
        phonebuffer,
        footer,
      ]);

      const req = client.request({
        ":method": "POST",
        ":path": "/RE4",
        "User-Agent": "Line/13.1.0",
        "X-Line-Access": accessToken,
        "X-Line-Application": "ANDROID\t13.1.0\tAndroid OS\t9",
        "X-Lal": "th_TH",
        "X-Lpv": "1",
        "Content-Type": "application/x-thrift",
        "Accept-Encoding": "gzip, deflate, br",
      });

      req.on("data", (chunk) => {
        console.log(chunk.toString());
      });

      req.on("end", () => {
        client.close();
        resolve();
      });

      req.on("error", (error) => {
        reject(error);
      });

      req.write(payload);
      req.end();
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

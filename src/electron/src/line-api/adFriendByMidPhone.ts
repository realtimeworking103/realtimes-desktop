import http2 from "http2";
import { lineconfig } from "../config/line-config.js";

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

      const byteids = Buffer.from([phone.length]);
      const phonebuffer = Buffer.from(phone, "utf8");

      const footer = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00]);

      const client = http2.connect(lineconfig.URL_LINE);

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
        "User-Agent": "Line/14.13.1",
        "X-Line-Access": accessToken,
        "X-Line-Application": "ANDROID\t14.13.1\tAndroid OS\t9",
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

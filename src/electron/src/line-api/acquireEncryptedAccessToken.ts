import http2 from "http2";
import { lineconfig } from "../config/line-config.js";

export function acquireEncryptedAccessToken(
  accessToken: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const payload = Buffer.from([
      0x82, 0x21, 0x01, 0x1b, 0x61, 0x63, 0x71, 0x75, 0x69, 0x72, 0x65, 0x45,
      0x6e, 0x63, 0x72, 0x79, 0x70, 0x74, 0x65, 0x64, 0x41, 0x63, 0x63, 0x65,
      0x73, 0x73, 0x54, 0x6f, 0x6b, 0x65, 0x6e, 0x25, 0x04, 0x00,
    ]);

    const client = http2.connect(lineconfig.URL_LINE);

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

    const chunks: Buffer[] = [];

    req.on("data", (chunk: Buffer) => chunks.push(chunk));

    req.on("end", () => {
      client.close();
      const acquireToken = chunks.toString().slice(42, chunks.length - 2);
      resolve(acquireToken);
    });

    req.on("error", (err: Error) => {
      client.close();
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

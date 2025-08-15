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

    const client = http2.connect(lineconfig.LINE_HOST_DOMAIN);

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

    req.on("response", (headers) => {
      console.log("Response Headers:");
      for (const name in headers) {
        console.log(`${name}: ${headers[name]}`);
      }
    });

    let responseBody = "";
    req.on("data", (chunk) => {
      const utf8 = chunk.toString("utf8");
      console.log("Response Body:", utf8);
      responseBody += utf8;
    });

    req.on("end", () => {
      client.close();
      const match = responseBody.match(/TTJ[A-Za-z0-9+/=]+/);
      if (match) {
        const acquireToken = match[0];
        resolve(acquireToken);
      } else {
        reject(new Error("No acquire token found"));
      }
    });

    req.on("error", (err) => {
      client.close();
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

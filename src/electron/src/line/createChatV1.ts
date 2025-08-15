import http2 from "http2";
import {
  encodeGroupName,
  encodeMid,
  encodeMidCount,
} from "./encodeCreateChat.js";
import { lineconfig } from "../config/line-config.js";
import { randomFromArray } from "../line-api/function.js";

export const createChatV1 = ({
  accessToken,
  nameGroup,
  contactMids,
}: {
  accessToken: string;
  nameGroup: string;
  contactMids: string[];
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    const header = Buffer.from([
      0x82, 0x21, 0x01, 0x0a, 0x63, 0x72, 0x65, 0x61, 0x74, 0x65, 0x43, 0x68,
      0x61, 0x74, 0x1c, 0x15, 0xc2, 0x3e,
    ]);
    const groupName = encodeGroupName(nameGroup);
    const midslength = encodeMidCount(contactMids.length);
    const allMids = encodeMid(contactMids);
    const footer = Buffer.from([0x18, 0x00, 0x00, 0x00]);
    const payload = Buffer.concat([
      header,
      groupName,
      midslength,
      allMids,
      footer,
    ]);

    const appVersion = randomFromArray(lineconfig.APP_VERSION_LIST);
    const systemVersion = randomFromArray(lineconfig.SYSTEM_VERSION_LIST);

    const client = http2.connect(lineconfig.LINE_HOST_DOMAIN);

    const req = client.request({
      ":method": "POST",
      ":path": "/S4",
      Accept: "application/x-thrift",
      "X-Line-Access": accessToken,
      "User-Agent": `Line/${appVersion}`,
      "Content-Type": "application/x-thrift",
      "X-Line-Application": `ANDROID\t${appVersion}\tAndroid OS\t${systemVersion}`,
      "X-Lal": "th_TH",
      "X-Lpv": "1",
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
      console.log("Request finished");
      client.close();
      const match = responseBody.match(/c[0-9a-f]{32}/i);
      if (match) {
        const chatMid = match[0];
        resolve(chatMid);
      } else {
        reject(new Error("ไม่พบ ChatMid"));
      }
    });

    req.on("error", (error) => {
      console.error("Request error:", error);
      reject(error);
    });

    req.write(payload);
    req.end();
  });
};

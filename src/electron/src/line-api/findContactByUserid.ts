import http2 from "http2";
import { addFriendByMid } from "./addFriendByMid.js";
import { getContactsV2 } from "./getContactsV2.js";

export const findContactByUserid = ({
  accessToken,
  SearchId,
}: {
  accessToken: string;
  SearchId: string;
}) => {
  const header = Buffer.from([
    0x82, 0x21, 0x01, 0x13, 0x66, 0x69, 0x6e, 0x64, 0x43, 0x6f, 0x6e, 0x74,
    0x61, 0x63, 0x74, 0x42, 0x79, 0x55, 0x73, 0x65, 0x72, 0x69, 0x64, 0x28,
  ]);
  const searchId = Buffer.from(SearchId, "utf-8");
  const lengthSearchId = Buffer.from([SearchId.length]);
  const footer = Buffer.from([0x00]);

  const payload = Buffer.concat([header, lengthSearchId, searchId, footer]);

  const client = http2.connect("https://legy.line-apps.com");

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
    const match = responseBody.match(/u[0-9a-f]{32}/i);
    if (match) {
      const mid = match[0];
      console.log("Mid:", mid);
      addFriendByMid({ accessToken, searchId: SearchId, mid });
      getContactsV2({ accessToken, mid });
    }

    return true;
  });

  req.write(payload);
  req.end();
};

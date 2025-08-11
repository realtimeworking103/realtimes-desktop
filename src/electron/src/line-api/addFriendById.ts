import http2 from "node:http2";
import { lineconfig } from "../config/line-config.js";

export function addFriendById({
  accessToken,
  userId,
  midUserId,
}: {
  accessToken: string;
  userId: string;
  midUserId: string;
}) {
  const header = Buffer.from([
    0x82, 0x21, 0x01, 0x0e, 0x61, 0x64, 0x64, 0x46, 0x72, 0x69, 0x65, 0x6e,
    0x64, 0x42, 0x79, 0x4d, 0x69, 0x64, 0x1c, 0x15, 0xf2, 0x2e, 0x18, 0x21,
  ]);

  const midbuff = Buffer.from(midUserId, "utf8");

  const backmid = Buffer.from([
    0x1c, 0x18, 0x2f, 0x7b, 0x22, 0x73, 0x63, 0x72, 0x65, 0x65, 0x6e, 0x22,
    0x3a, 0x22, 0x66, 0x72, 0x69, 0x65, 0x6e, 0x64, 0x41, 0x64, 0x64, 0x3a,
    0x69, 0x64, 0x53, 0x65, 0x61, 0x72, 0x63, 0x68, 0x22, 0x2c, 0x22, 0x73,
    0x70, 0x65, 0x63, 0x22, 0x3a, 0x22, 0x6e, 0x61, 0x74, 0x69, 0x76, 0x65,
    0x22, 0x7d, 0x2c, 0x2c, 0x18,
  ]);

  const byteids = Buffer.from([userId.length]);
  const userIdbuffer = Buffer.from(userId, "utf8");
  const footer = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00]);

  const payload = Buffer.concat([
    header,
    midbuff,
    backmid,
    byteids,
    userIdbuffer,
    footer,
  ]);

  console.log("payload", payload.toString("utf8"));

  const client = http2.connect(lineconfig.URL_LINE);

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

  req.on("data", (chunk) => {
    console.log(chunk.toString());
  });

  req.on("end", () => {
    client.close();
    return true;
  });

  req.on("error", (err) => {
    client.close();
    console.error(err);
  });

  req.write(payload);
  req.end();
}

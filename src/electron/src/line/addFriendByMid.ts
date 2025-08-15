import http2 from "http2";
import { lineconfig } from "../config/line-config.js";
import { randomFromArray } from "../line-api/function.js";

export function addFriendByMid({
  accessToken,
  searchId,
  mid,
}: {
  accessToken: string;
  searchId: string;
  mid: string;
}) {
  const header = Buffer.from([
    0x82, 0x21, 0x01, 0x0e, 0x61, 0x64, 0x64, 0x46, 0x72, 0x69, 0x65, 0x6e,
    0x64, 0x42, 0x79, 0x4d, 0x69, 0x64, 0x1c, 0x15, 0xf2, 0x2e, 0x18, 0x21,
  ]);

  const midbuffer = Buffer.from(mid, "utf8");

  const screenbuffer = Buffer.from([
    0x1c, 0x18, 0x2f, 0x7b, 0x22, 0x73, 0x63, 0x72, 0x65, 0x65, 0x6e, 0x22,
    0x3a, 0x22, 0x66, 0x72, 0x69, 0x65, 0x6e, 0x64, 0x41, 0x64, 0x64, 0x3a,
    0x69, 0x64, 0x53, 0x65, 0x61, 0x72, 0x63, 0x68, 0x22, 0x2c, 0x22, 0x73,
    0x70, 0x65, 0x63, 0x22, 0x3a, 0x22, 0x6e, 0x61, 0x74, 0x69, 0x76, 0x65,
    0x22, 0x7d, 0x1c, 0x3c, 0x18,
  ]);

  const searchIdlength = Buffer.from([searchId.length]);

  const searchIdbuffer = Buffer.from(searchId, "utf8");

  const footer = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00]);

  const payload = Buffer.concat([
    header,
    midbuffer,
    screenbuffer,
    searchIdlength,
    searchIdbuffer,
    footer,
  ]);

  const appVersion = randomFromArray(lineconfig.APP_VERSION_LIST);
  const systemVersion = randomFromArray(lineconfig.SYSTEM_VERSION_LIST);

  const client = http2.connect(lineconfig.LINE_HOST_DOMAIN);

  const req = client.request({
    ":method": "POST",
    ":path": "/RE4",
    "User-Agent": `Line/${appVersion}`,
    "X-Line-Access": accessToken,
    "X-Line-Application": `ANDROID\t${appVersion}\tAndroid OS\t${systemVersion}`,
    "X-Lal": "th_TH",
    "X-Lpv": "1",
    "Content-Type": "application/x-thrift",
    "Accept-Encoding": "gzip, deflate, br",
  });

  req.on("data", (chunk) => {
    const utf8 = chunk.toString("utf8");
    console.log("Response Body:", utf8);
    console.log("appVersion:", appVersion);
    console.log("systemVersion:", systemVersion);
  });

  req.on("end", () => {
    console.log("Request finished");
    client.close();
  });

  req.on("error", (err) => {
    console.error("Request error:", err);
  });

  req.write(payload);
  req.end();
}

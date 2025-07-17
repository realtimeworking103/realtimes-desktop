import http2 from "http2";
import { lineconfig } from "../config/line-config.js";

function getRandomOid(): string {
  const randomNum = Math.floor(Math.random() * 8) + 1;
  const padded = randomNum.toString().padStart(2, "0");
  return `p00000000000000000000000000000${padded}`;
}

export function uploadImageToGroup(
  groupId: string,
  acqyireToken: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const oid = getRandomOid();

    const payload = JSON.stringify({
      src: {
        svcCode: "public",
        sid: "group",
        oid,
        relay: {
          headers: {},
          params: {},
          commonHeaders: [],
        },
      },
      dst: {
        relay: {
          headers: {},
          params: {},
          commonHeaders: [],
        },
      },
      options: {},
    });

    const client = http2.connect(lineconfig.URL_LINE);

    const req = client.request({
      ":method": "POST",
      ":path": `/oa/r/talk/g/${groupId}/copy.obs`,
      "X-Obs-Channeltype": "legy",
      "X-Obs-Host": "obs-th.line-apps.com",
      "X-Line-Access": acqyireToken,
      "X-Line-Application": "ANDROID\t15.2.1\tAndroid OS\t9",
      "User-Agent": "Line/15.2.1",
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload).toString(),
      "Accept-Encoding": "gzip, deflate, br",
    });

    // req.on("response", (headers) => {
    //   console.log("RESPONSE HEADERS:", headers);
    // });

    req.on("data", (chunk) => {
      console.log(`Response Body UploadImageGroup :`,chunk.toString());
    });

    req.on("end", () => {
      client.close();
      resolve();
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

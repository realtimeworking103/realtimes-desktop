import http2 from "http2";
import { lineconfig } from "../config/line-config.js";

function getRandomOid(): string {
  const randomNum = Math.floor(Math.random() * 8) + 1;
  const padded = randomNum.toString().padStart(2, "0");
  return `p00000000000000000000000000000${padded}`;
}

export function updateProfileDefault(chatMid: string, acqyireToken: string) {
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

  const client = http2.connect(lineconfig.LINE_HOST_DOMAIN);

  const req = client.request({
    ":method": "POST",
    ":path": `/oa/r/talk/g/${chatMid}/copy.obs`,
    "X-Obs-Channeltype": "legy",
    "X-Obs-Host": "obs-th.line-apps.com",
    "X-Line-Access": acqyireToken,
    "X-Line-Application": "ANDROID\t13.1.0\tAndroid OS\t9",
    "User-Agent": "Line/13.1.0",
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload).toString(),
    "Accept-Encoding": "gzip, deflate, br",
  });

  req.on("data", (chunk) => {
    console.log(`Response Body UpdateProfileDefault :`, chunk.toString());
  });

  req.on("end", () => {
    client.close();
  });

  req.on("error", () => {
    client.close();
  });

  req.write(payload);
  req.end();
}

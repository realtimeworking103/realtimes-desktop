import fs from "fs";
import path from "path";
import https from "https";

const IMAGE_PATH = "./profile.jpg";

function readImage(filePath: string): Buffer {
  return fs.readFileSync(filePath);
}

function makeObsParams(buffer: Buffer): string {
  const length = buffer.length;
  const timestamp = Date.now();
  const obj = {
    ver: "2.0",
    name: `profile_${timestamp}${path.extname(IMAGE_PATH)}`,
    range: `bytes 0-${length - 1}/${length}`,
    type: "IMAGE",
  };
  const json = JSON.stringify(obj);
  return Buffer.from(json).toString("base64");
}

export function uploadImageWithHttps(
  token: string,
  imagePath: string,
  chatmid: string,
) {
  const payload = readImage(imagePath);
  const obsParams = makeObsParams(payload);

  const options: https.RequestOptions = {
    hostname: "obs-th.line-apps.com",
    port: 443,
    path: "/r/talk/g/" + chatmid,
    method: "POST",
    headers: {
      "x-obs-params": obsParams,
      "content-type": "image/jpeg",
      accept: "*/*",
      connection: "keep-alive",
      "cache-control": "no-cache",
      "x-lal": "th_TH",
      "X-Line-Carrier": "52003,1-0",
      "X-Line-Access": token,
      "X-Line-Application": "ANDROID\t13.1.0\tAndroid OS\t9",
      "User-Agent": "Line/13.1.0",
      "Accept-Encoding": "gzip, deflate, br",
    },
  };

  const req = https.request(options, (res) => {
    console.log("STATUS:", res.statusCode);
    res.on("data", (chunk) => {
      console.log("BODY:", chunk.toString());
    });
    res.on("end", () => {
      console.log("Upload complete.");
    });
  });

  req.on("error", (err) => {
    console.error("Request error:", err);
  });

  req.write(payload);
  req.end();
}

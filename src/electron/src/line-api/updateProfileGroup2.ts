import fs from "fs";
import https from "https";

function readImage(profile: string): Buffer {
  return fs.readFileSync(profile);
}

function makeObsParams(buffer: Buffer): string {
  const length = buffer.length;
  const timestamp = Date.now();
  const obj = {
    ver: "2.0",
    name: `profile_${timestamp}.jpg`,
    range: `bytes 0-${length - 1}/${length}`,
    type: "IMAGE",
  };
  const json = JSON.stringify(obj);
  return Buffer.from(json).toString("base64");
}

export async function uploadImageWithHttps({
  chatMid,
  acquireToken,
  profile,
}: {
  chatMid: string;
  acquireToken: string;
  profile: string;
}) {
  try {
    const payload = readImage(profile);
    const obsParams = makeObsParams(payload);

    const options: https.RequestOptions = {
      hostname: "obs-th.line-apps.com",
      port: 443,
      path: "/r/talk/g/" + chatMid,
      method: "POST",
      headers: {
        "x-obs-params": obsParams,
        "content-type": "image/jpeg",
        accept: "*/*",
        connection: "keep-alive",
        "cache-control": "no-cache",
        "x-lal": "th_TH",
        "X-Line-Carrier": "52003,1-0",
        "X-Line-Access": acquireToken,
        "X-Line-Application": "ANDROID\t13.1.0\tAndroid OS\t9",
        "User-Agent": "Line/13.1.0",
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Length": payload.length,
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

    req.on("error", async (err) => {
      console.error("Request error:", err);
    });

    req.write(payload);
    req.end();
  } catch (error) {
    console.error("Upload Image Fail:", error);
  }
}

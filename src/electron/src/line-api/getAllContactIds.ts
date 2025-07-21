import http2 from "http2";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { lineconfig } from "../config/line-config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contactFolder = "ContactMids";

const contactDir = path.join(__dirname, contactFolder);
if (!fs.existsSync(contactDir)) {
  fs.mkdirSync(contactDir, { recursive: true });
}

export async function getAllContactIds(accessToken: string): Promise<string[]> {
  // Input validation
  if (!accessToken || accessToken.trim() === "") {
    throw new Error("Access token is required");
  }

  const token = accessToken.split(":")[0];
  if (!token) {
    throw new Error("Invalid access token format");
  }

  const filePath = path.join(contactDir, `${token}.txt`);

  const payload = Buffer.from([
    0x82, 0x21, 0x01, 0x10, 0x67, 0x65, 0x74, 0x41, 0x6c, 0x6c, 0x43, 0x6f,
    0x6e, 0x74, 0x61, 0x63, 0x74, 0x49, 0x64, 0x73, 0x15, 0x02, 0x00,
  ]);

  return new Promise<string[]>((resolve, reject) => {
    const timeout = setTimeout(() => {
      client.close();
      reject(new Error("Request timeout"));
    }, 30000); // 30 seconds timeout

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

    let body = "";
    req.on("data", (chunk) => {
      console.log(`Response Body GetContact :`, chunk.toString());
      body += chunk.toString();
    });

    req.on("end", () => {
      clearTimeout(timeout);
      client.close();

      const mids = body.match(/u[a-f0-9]{32}/gi) || [];
      if (mids.length) {
        try {
          fs.writeFileSync(filePath, mids.join("\n") + "\n", "utf8");
          console.log(`save ${mids.length} to File ${filePath}`);
        } catch (error) {
          console.error("Error writing contact file:", error);
        }
      } else {
        console.log("not found response");
      }
      resolve(mids);
    });

    req.on("error", (err) => {
      clearTimeout(timeout);
      client.close();
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

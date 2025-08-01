import http2 from "http2";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { lineconfig } from "../config/line-config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputFilename = "admin.txt";
const outputPath = path.join(__dirname, outputFilename);

function buildFindContactPayload(idLine: string): Buffer {
  const header = Buffer.from([
    0x82, 0x21, 0x01, 0x13, 0x66, 0x69, 0x6e, 0x64, 0x43, 0x6f, 0x6e, 0x74,
    0x61, 0x63, 0x74, 0x42, 0x79, 0x55, 0x73, 0x65, 0x72, 0x69, 0x64, 0x28,
  ]);
  const idBuf = Buffer.from(idLine, "utf8");
  const lenBuf = Buffer.from([idBuf.length]);
  const footer = Buffer.from([0x00]);
  return Buffer.concat([header, lenBuf, idBuf, footer]);
}

export async function findContactByUserid(
  accessToken: string,
  ids: string[],
): Promise<void> {
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  }

  for (const id of ids) {
    const payload = buildFindContactPayload(id);
    const client = http2.connect(lineconfig.URL_LINE);

    await new Promise<void>((resolve, reject) => {
      const req = client.request({
        ":method": "POST",
        ":path": "/S4",
        "User-Agent": "Line/15.2.1",
        "X-Line-Access": accessToken,
        "X-Line-Application": "ANDROID\t15.2.1\tAndroid OS\t9",
        "X-Lal": "th_TH",
        "X-Lpv": "1",
        "Content-Type": "application/x-thrift",
      });

      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        client.close();
        const mid = body.slice(27, 60);
        if (mid && mid.startsWith("u")) {
          fs.appendFileSync(outputPath, mid + "\n", "utf8");
          console.log(`Found Mid Oa: ${mid}`);
        } else {
          console.warn(`not found mid ${id}`);
        }
        resolve();
      });

      req.on("error", reject);
      req.write(payload);
      req.end();
    });
  }
}

import fs from "fs";
import http2 from "http2";
import {
  updateSettingsAttributes1,
  updateSettingsAttributes2,
} from "./updateSettingsAttributes.js";

const PHONE_FILE = "phones.txt";

function readPhonesFromFile(): string[] {
  const raw = fs.readFileSync(PHONE_FILE, "utf-8");
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function writePhonesToFile(phones: string[]): void {
  fs.writeFileSync(PHONE_FILE, phones.join("\n"), "utf-8");
}

function createContactBuffer(index: number, phone: string): Buffer {
  const indexSizeByte = Math.floor(Math.log10(Math.abs(index))) + 1;
  const indexBytes = index
    .toString()
    .split("")
    .map((num) => parseInt(`0x3${num}`, 16));
  const numberBytes = Buffer.from(phone, "utf-8");
  return Buffer.from([
    0x15,
    0x00,
    0x18,
    indexSizeByte,
    ...indexBytes,
    0x99,
    0x18,
    0x0c,
    ...numberBytes,
    0x19,
    0x08,
    0x00,
  ]);
}

function createContactBuffers(phones: string[]): Buffer {
  return Buffer.concat(
    phones.map((phone, idx) => createContactBuffer(idx + 1, phone)),
  );
}

const header = Buffer.from([
  0x82, 0x21, 0x01, 0x0c, 0x73, 0x79, 0x6e, 0x63, 0x43, 0x6f, 0x6e, 0x74, 0x61,
  0x63, 0x74, 0x73, 0x15, 0xf6, 0x2e, 0x19, 0xfc,
]);
const footer = Buffer.from([0x00]);

function syncContacts(phones: string[], accessToken: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const client = http2.connect("https://legy-backup.line-apps.com");

    const countBuf = Buffer.from([phones.length]);
    const contactBuf = createContactBuffers(phones);
    const payload = Buffer.concat([header, countBuf, contactBuf, footer]);

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

    const chunks: Buffer[] = [];

    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      client.close();
      const resBuffer = Buffer.concat(chunks);
      const resString = resBuffer.toString("utf8");
      const matches = resString.match(/\b\d{10,11}\b/g) || [];
      const unique = Array.from(new Set(matches));
      resolve(unique.length);
    });

    req.on("error", (err) => {
      client.close();
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

export const addFriends = async (
  phones: string[],
  target: number,
  accessToken: string,
): Promise<void> => {
  updateSettingsAttributes1(accessToken);
  updateSettingsAttributes2(accessToken);
  let friendCounter = 0;
  let batchTracking = 0;
  const usedPhones: string[] = [];

  while (friendCounter < target && batchTracking < phones.length) {
    const batchSize = Math.min(10, target - friendCounter);
    const slice = phones.slice(batchTracking, batchTracking + batchSize);
    batchTracking += batchSize;

    const response = await syncContacts(slice, accessToken);
    friendCounter += response;

    usedPhones.push(...slice);

    console.log(`เพิ่มเพื่อนไปแล้ว: ${friendCounter}/${target}`);
  }

  const remainingPhones = phones.filter((phone) => !usedPhones.includes(phone));
  writePhonesToFile(remainingPhones);

  console.log(`เพิ่มเพื่อนเสร็จทั้งหมด ${friendCounter} คน`);
  console.log(`เบอร์ที่เหลือในไฟล์: ${remainingPhones.length}`);
};

import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import crypto from "crypto";

import db from "./config-db.js";

import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function decryptAndSaveProfile(ldName: string): Promise<void> {
  const pulledDbPath = path.resolve(
    __dirname,
    `../../databaseldplayer/naver_line_${ldName}.db`,
  );

  if (!fs.existsSync(pulledDbPath)) {
    console.error(`Database file not found: ${pulledDbPath}`);
    return;
  }

  const pulledDb = new Database(pulledDbPath, { readonly: true });

  try {
    const tableExists = pulledDb
      .prepare(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='setting'`,
      )
      .get();

    if (!tableExists) {
      db.prepare(
        `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
      ).run("บัญชีไม่ได้สมัคร", ldName);
      console.warn(`LDPlayer ${ldName} Not Found Table Setting`);
      return;
    }

    const decryptor = new LineProfileDecryptor(pulledDbPath);
    const profile = decryptor.decryptProfile();

    if (!profile) {
      db.prepare(
        `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
      ).run("บัญชีไม่ได้สมัคร", ldName);
      console.warn(`ถอดรหัสโปรไฟล์ล้มเหลว: ${ldName}`);
      return;
    }

    db.prepare(
      `UPDATE GridLD
       SET StatusAccGridLD = ?, StatusGridLD = ?, TokenGridLD = ?, NameLineGridLD = ?, PhoneGridLD = ?, DateTimeGridLD = datetime('now', 'localtime'), CreateAt = datetime('now', 'localtime')
       WHERE LDPlayerGridLD = ?`,
    ).run(
      "บัญชีไลน์พร้อมทำงาน",
      "เก็บ Token สำเร็จ",
      profile.token,
      profile.name,
      profile.phone,
      ldName,
    );

    console.log(`AuthKey: ${profile.authKey}`);
    console.log(`Token: ${profile.token}`);
    console.log(`Name: ${profile.name}`);
    console.log(`Phone: ${profile.phone}`);
    console.log(`Token saved for ${ldName}`);
  } catch (err: any) {
    db.prepare(
      `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
    ).run("เก็บ Token ไม่สำเร็จ", ldName);

    console.error(`Error decrypting ${ldName}:`, err.message);
  } finally {
    pulledDb.close();
  }
}

export interface LineProfile {
  mid: string;
  authKey: string;
  name: string;
  phone: string;
  token: string;
}

export class LineProfileDecryptor {
  private dbPath: string;

  constructor(path: string) {
    this.dbPath = path;
  }

  private getSetting(key: string): string | null {
    const db = new Database(this.dbPath, { readonly: true });
    const row = db
      .prepare("SELECT value FROM setting WHERE key = ?")
      .get(key) as { value: string } | undefined;
    return row?.value ?? null;
  }

  private crazyOperation(key: number, constant: number): Buffer {
    const byte = (n: number) => n & 0xff;
    const arr = Buffer.alloc(16);
    arr[0] = byte(key);
    arr[1] = byte(key - 71);
    arr[2] = byte(key - 142);

    for (let i = 3; i < 16; i++) {
      arr[i] = byte(i ^ (0xffffffb9 ^ (arr[i - 3] ^ arr[i - 2])));
    }

    if (constant < 2 && constant > -2) {
      constant = 0xfffffffffffb389d + 0xd2dfaf * constant;
    }

    let j = 0,
      k = -7;
    for (let i = 0; i < arr.length; i++) {
      const k1 = (j + 1) & (arr.length - 1);
      const l1 = BigInt(constant) * BigInt(arr[k1]) + BigInt(k);
      k = Number((l1 >> 32n) & 0xffn);
      let i2 = l1 + BigInt(k);

      if (i2 < BigInt(k)) {
        i2++;
        k++;
      }

      arr[k1] = byte(Number(-2n - i2));
      j = k1;
    }

    return arr;
  }

  private decryptSetting(value: string, key: number): string | null {
    try {
      const ciphertext = Buffer.from(value, "base64");
      const aesKey = this.crazyOperation(key, 0xec4ba7);

      const decipher = crypto.createDecipheriv("aes-128-ecb", aesKey, null);
      decipher.setAutoPadding(false);
      const decrypted = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final(),
      ]);
      const paddingLength = decrypted[decrypted.length - 1];
      return decrypted.slice(0, -paddingLength).toString("utf-8");
    } catch {
      return null;
    }
  }

  private isProfileAuthKey(value: string): boolean {
    return /^u[a-z0-9]{32}:[a-zA-Z0-9+/=]+$/.test(value);
  }

  private bruteforceKey(authKeyValue: string): number {
    for (let key = 0; key <= 0x3ff; key++) {
      const plaintext = this.decryptSetting(authKeyValue, key);
      if (plaintext && this.isProfileAuthKey(plaintext)) {
        return key;
      }
    }
    throw new Error("Couldn't brute force key.");
  }

  private formatPhone(phone: string): string {
    return phone.startsWith("+66")
      ? "0" + phone.slice(3).replace(/\s+/g, "")
      : phone;
  }

  public decryptProfile(): LineProfile | null {
    const encryptedAuthKey = this.getSetting("PROFILE_AUTH_KEY");
    if (!encryptedAuthKey) {
      console.error("PROFILE_AUTH_KEY not found");
      return null;
    }

    const key = this.bruteforceKey(encryptedAuthKey);
    const decrypted = this.decryptSetting(encryptedAuthKey, key);

    if (!decrypted || !this.isProfileAuthKey(decrypted)) {
      console.error("Failed to decrypt valid PROFILE_AUTH_KEY");
      return null;
    }

    const [mid, authKey] = decrypted.split(":");
    const nameEncrypted = this.getSetting("PROFILE_NAME");
    const phoneEncrypted = this.getSetting("PROFILE_NORMALIZED_PHONE");

    const name = nameEncrypted
      ? (this.decryptSetting(nameEncrypted, key) ?? "")
      : "";
    let phone = phoneEncrypted
      ? (this.decryptSetting(phoneEncrypted, key) ?? "")
      : "";
    phone = this.formatPhone(phone);

    const token = TokenGenerator.createToken(`${mid}:${authKey}`);

    return {
      mid,
      authKey: `${mid}:${authKey}`,
      name,
      phone,
      token,
    };
  }
}

export class TokenGenerator {
  static getSHA256Sum(...args: (string | Buffer)[]): Buffer {
    const sha256 = crypto.createHash("sha256");
    for (const arg of args) {
      if (typeof arg === "string") {
        sha256.update(Buffer.from(arg, "utf-8"));
      } else if (Buffer.isBuffer(arg)) {
        sha256.update(arg);
      } else {
        throw new Error("Unsupported argument type");
      }
    }
    return sha256.digest();
  }

  static getSHA256SumTest(
    keyData: Buffer,
    salt: Buffer,
    additional: Buffer,
  ): Buffer {
    const sha256 = crypto.createHash("sha256");
    sha256.update(keyData);
    sha256.update(salt);
    sha256.update(additional);
    return sha256.digest();
  }

  static pad(bytes: Buffer, blockSize: number): Buffer {
    const paddingRequired = blockSize - (bytes.length % blockSize) || blockSize;
    const paddedArray = Buffer.alloc(bytes.length + paddingRequired);
    bytes.copy(paddedArray, 0);
    paddedArray.fill(paddingRequired, bytes.length);
    return paddedArray;
  }

  static getIssuedAt(): string {
    const iat = `iat: ${Math.floor(Date.now() / 1000) * 60}\n`;
    // const iat = `iat: ${104812828440}\n`;
    return Buffer.from(iat, "utf-8").toString("base64") + ".";
  }

  static getDigest(key: Buffer, iat: string): string {
    const hmac = crypto.createHmac("sha1", key);
    hmac.update(iat, "utf-8");
    return hmac.digest("base64");
  }

  static createToken(authKey: string): string {
    const [mid, base64Key] = authKey.split(":");
    const key = Buffer.from(base64Key, "base64");

    const iat = this.getIssuedAt();
    const digest = this.getDigest(key, iat);

    return `${mid}:${iat}.${digest}`;
  }
}

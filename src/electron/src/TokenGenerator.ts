import crypto from "crypto";

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

    const iat = this.getIssuedAt(); // ends with "."
    const digest = this.getDigest(key, iat);

    return `${mid}:${iat}${digest}`;
  }
}

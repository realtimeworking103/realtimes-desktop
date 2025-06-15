// src/utils/lineBuffers.ts
export function encodeGroupName(nameGroup: string): Buffer {
  const buf = Buffer.from(nameGroup, "utf8");
  // 0x15 = field 2 wire type 2, 0x02 = field number, 0x18 = length-delimited tag, buf.length = ความยาว
  return Buffer.concat([Buffer.from([0x15, 0x02, 0x18, buf.length]), buf]);
}

export function encodeMid(mid: string): Buffer {
  // mid จะเป็นรูปแบบ "uXXXXXXXX..." เราจะตัดตัวแรกออก
  const id = mid.slice(1);
  return Buffer.concat([
    Buffer.from([0x21]), // tag สำหรับ field 4 wire type 1
    Buffer.from([0x75]), // tag สำหรับ field 5 wire type 1
    Buffer.from(id, "utf8"), // ข้อมูล MID ที่แท้จริง
  ]);
}

export function getMidCountBytes(count: number): Buffer {
  if (count < 0 || count > 99) {
    throw new Error(`MID count not supported: ${count}`);
  }

  const tag = 0x1a; // tag สำหรับ field 3 wire type 2

  if (count < 14) {
    // สำหรับ count < 14: สูตร secondByte = (count << 4) | 0x08
    const secondByte = (count << 4) | 0x08;
    return Buffer.from([tag, secondByte]);
  } else {
    // สำหรับ count ระหว่าง 14–99: ใช้ prefix 0xF8 แล้วคำนวณ thirdByte = 0x30 + (count - 48)
    const secondByte = 0xf8;
    const thirdByte = 0x30 + (count - 48);
    return Buffer.from([tag, secondByte, thirdByte]);
  }
}
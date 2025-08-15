export function encodeGroupName(nameGroup: string): Buffer {
  const buf = Buffer.from(nameGroup, "utf8");
  return Buffer.concat([Buffer.from([0x15, 0x02, 0x18, buf.length]), buf]);
}

export function encodeMid(mids: string[]) {
  const allMids = mids.map((mid) => {
    const id = mid.slice(1);
    return Buffer.concat([
      Buffer.from([0x21]),
      Buffer.from([0x75]),
      Buffer.from(id, "utf8"),
    ]);
  });
  return Buffer.concat(allMids);
}

export function encodeMidCount(count: number) {
  if (count < 0 || count > 99) {
    throw new Error(`MID count not supported: ${count}`);
  }

  const tag = 0x1a;

  if (count < 14) {
    const secondByte = (count << 4) | 0x08;
    return Buffer.from([tag, secondByte]);
  } else {
    const secondByte = 0xf8;
    const thirdByte = 0x30 + (count - 48);
    return Buffer.from([tag, secondByte, thirdByte]);
  }
}

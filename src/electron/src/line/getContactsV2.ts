import http2 from "http2";

export function getContactsV2({
  accessToken,
  mid,
}: {
  accessToken: string;
  mid: string;
}) {
  const header = Buffer.from([
    0x82, 0x21, 0x01, 0x0d, 0x67, 0x65, 0x74, 0x43, 0x6f, 0x6e, 0x74, 0x61,
    0x63, 0x74, 0x73, 0x56, 0x32, 0x1c, 0x19, 0x18, 0x21,
  ]);

  const midbuffer = Buffer.from(mid, "utf8");

  const footer = Buffer.from([0x1a, 0x05, 0x12, 0x00, 0x15, 0x10, 0x00]);

  const payload = Buffer.concat([header, midbuffer, footer]);

  const client = http2.connect("https://legy.line-apps.com");

  const req = client.request({
    ":method": "POST",
    ":path": "/S4",
    Accept: "application/x-thrift",
    "User-Agent": "Line/13.1.0",
    "X-Line-Access": accessToken,
    "X-Line-Application": "ANDROID\t13.1.0\tAndroid OS\t9",
    "X-Lal": "th_TH",
    "X-Lpv": "1",
    "Content-Type": "application/x-thrift",
    "Accept-Encoding": "gzip, deflate, br",
  });

  req.on("response", (headers) => {
    console.log("Response Headers:");
    for (const name in headers) {
      console.log(`${name}: ${headers[name]}`);
    }
  });

  req.on("data", (chunk) => {
    const utf8 = chunk.toString("utf8");
    console.log("Response Body:", utf8);
  });

  req.on("end", () => {
    console.log("Request finished");
    client.close();
  });

  req.on("error", (err) => {
    console.error("Request error:", err);
  });

  req.write(payload);
  req.end();
}

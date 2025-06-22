import http2 from "http2";

export async function addKaiOa(
  accessToken: string,
  idLineOa: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const header = Buffer.from([
      0x82, 0x21, 0x01, 0x13, 0x66, 0x69, 0x6e, 0x64, 0x43, 0x6f, 0x6e, 0x74,
      0x61, 0x63, 0x74, 0x42, 0x79, 0x55, 0x73, 0x65, 0x72, 0x69, 0x64, 0x28,
    ]);

    const idsbuff = Buffer.from(idLineOa, "utf8");
    const ByteLineID = Buffer.from([idsbuff.length]);
    const footer = Buffer.from([0x00]);
    const payload = Buffer.concat([header, ByteLineID, idsbuff, footer]);

    const client = http2.connect("https://legy-backup.line-apps.com");

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
    req.on("response", (headers) => {
      for (const name in headers) {
        console.log(`${name}: ${headers[name]}`);
      }
    });

    req.on("data", (chunk) => {
      body += chunk.toString("utf8");
    });

    req.on("end", async () => {
      client.close();
      const mid = body.slice(27, 60);
      console.log("OA MID:", mid);

      try {
        await addFriendByIdOa(accessToken, idLineOa, mid);
        resolve();
      } catch (err) {
        reject(err);
      }
    });

    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

export async function addFriendByIdOa(
  accessToken: string,
  idLineOa: string,
  mid: string,
) {
  const header = Buffer.from([
    0x82, 0x21, 0x01, 0x0e, 0x61, 0x64, 0x64, 0x46, 0x72, 0x69, 0x65, 0x6e,
    0x64, 0x42, 0x79, 0x4d, 0x69, 0x64, 0x1c, 0x15, 0xc2, 0x3e, 0x18, 0x21,
  ]);

  const midbuff = Buffer.from(mid, "utf8");

  const backmid = Buffer.from([
    0x1c, 0x18, 0x2f, 0x7b, 0x22, 0x73, 0x63, 0x72, 0x65, 0x65, 0x6e, 0x22,
    0x3a, 0x22, 0x66, 0x72, 0x69, 0x65, 0x6e, 0x64, 0x41, 0x64, 0x64, 0x3a,
    0x69, 0x64, 0x53, 0x65, 0x61, 0x72, 0x63, 0x68, 0x22, 0x2c, 0x22, 0x73,
    0x70, 0x65, 0x63, 0x22, 0x3a, 0x22, 0x6e, 0x61, 0x74, 0x69, 0x76, 0x65,
    0x22, 0x7d, 0x2c, 0x2c, 0x18,
  ]);

  const byteids = Buffer.from([idLineOa.length]);
  const idsbuff = Buffer.from(idLineOa, "utf8");
  const footer = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00]);

  const payload = Buffer.concat([
    header,
    midbuff,
    backmid,
    byteids,
    idsbuff,
    footer,
  ]);

  console.log(payload.toString("utf8"));

  const client = http2.connect("https://legy-backup.line-apps.com");

  const req = client.request({
    ":method": "POST",
    ":path": "/RE4",
    "User-Agent": "Line/15.2.1",
    "X-Line-Access": accessToken,
    "X-Line-Application": "ANDROID\t15.2.1\tAndroid OS\t9",
    "X-Lal": "th_TH",
    "X-Lpv": "1",
    "Content-Type": "application/x-thrift",
    "Accept-Encoding": "gzip, deflate, br",
  });

  req.on("response", (headers) => {
    for (const name in headers) {
      console.log(`${name}: ${headers[name]}`);
    }
  });

  req.on("data", (chunk) => {
    console.log("Response Body:", chunk.toString("utf8"));
  });

  req.on("end", () => {
    client.close();
  });

  req.write(payload);

  req.end();
}

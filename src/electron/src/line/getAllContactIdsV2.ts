import http2 from "http2";

export async function getAllContactIdsV2(
  accessToken: string,
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const payload = Buffer.from([
      0x82, 0x21, 0x01, 0x10, 0x67, 0x65, 0x74, 0x41, 0x6c, 0x6c, 0x43, 0x6f,
      0x6e, 0x74, 0x61, 0x63, 0x74, 0x49, 0x64, 0x73, 0x15, 0x02, 0x00,
    ]);

    const client = http2.connect("https://legy.line-apps.com");

    const req = client.request({
      ":method": "POST",
      ":path": "/S4",
      "User-Agent": "Line/13.1.0",
      "X-Line-Access": accessToken,
      "X-Line-Application": "ANDROID\t13.1.0\tAndroid OS\t9",
      "X-Lal": "th_TH",
      "X-Lpv": "1",
      "Content-Type": "application/x-thrift",
      "Accept-Encoding": "gzip, deflate, br",
    });

    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      client.close();
      const allMids = body.match(/u[a-f0-9]{32}/gi) || [];
      console.log("allMids", allMids);
      resolve(allMids);
    });

    req.on("error", (err) => {
      client.close();
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

import http2 from "http2";


export function createGroupImg(
  groupId: string,
  tokenImg: string,
): Promise<void> {
  console.log(tokenImg);
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      src: {
        svcCode: "public",
        sid: "group",
        oid: "p0000000000000000000000000000003",
        relay: { headers: {}, params: {}, commonHeaders: [] },
      },
      dst: {
        relay: { headers: {}, params: {}, commonHeaders: [] },
      },
      options: {},
    });

    const client = http2.connect("https://legy-backup.line-apps.com");

    let isClosed = false;
    const safeClose = () => {
      if (!isClosed) {
        client.close();
        isClosed = true;
      }
    };

    const req = client.request({
      ":method": "POST",
      ":path": `/oa/r/talk/g/${groupId}/copy.obs`,
      "x-obs-channeltype": "legy",
      "x-obs-host": "obs-th.line-apps.com",
      "x-line-access": tokenImg,
      "x-line-application": "ANDROID\t15.2.1\tAndroid OS\t9",
      "user-agent": "Line/15.2.1",
      "content-type": "application/json",
      "accept-encoding": "gzip, deflate, br",
    });

    let resBody = "";
    req.setEncoding("utf8");

    req.on("response", (headers) => {
      console.log("RESPONSE HEADERS:", headers);
    });

    req.on("data", (chunk) => {
      resBody += chunk;
    });

    req.on("end", () => {
      console.log("RESPONSE BODY:", resBody);
      // safeClose();
      client.close();
      resolve();
    });

    req.on("error", (err) => {
      console.error("Request error:", err);
      // safeClose();
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

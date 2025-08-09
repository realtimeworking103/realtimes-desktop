import { loginWithAuthToken } from "@evex/linejs";
import { FileStorage } from "@evex/linejs/storage";
import { uploadImageWithHttps } from "../line-api/updateProfileGroup2.js";
import db from "../services/sqliteService.js";

export const createChat = async ({
  ldName,
  accessToken,
  nameGroup,
  profile,
  message,
}: {
  ldName: string;
  accessToken: string;
  nameGroup: string;
  profile: string;
  message: string;
}) => {
  const client = await loginWithAuthToken(accessToken, {
    device: "IOS",
    storage: new FileStorage("./storage.json"),
  });

  try {
    const getAllContactIds = await client.base.talk.getAllContactIds();

    const responseChat = await client.base.talk.createChat({
      request: {
        reqSeq: 0,
        type: 1,
        name: nameGroup,
        targetUserMids: getAllContactIds,
        picturePath: "",
      },
    });

    let token = await client.base.talk.acquireEncryptedAccessToken({
      featureType: 2,
    });
    const pattern3 = /TTJ[A-Za-z0-9+/=]+/;
    const match = token.toString().match(pattern3);
    if (match) {
      const result = match[0];
      token = result;
    }

    await uploadImageWithHttps({
      acquireToken: token,
      chatMid: responseChat.chat.chatMid,
      profile: profile,
    });

    await client.base.talk.sendMessage({
      to: responseChat.chat.chatMid,
      text: message,
    });

    const row = db
      .prepare(`SELECT GroupGridLD FROM GridLD WHERE LDPlayerGridLD = ?`)
      .get(ldName) as { GroupGridLD: string };

    const currentCount = parseInt(row?.GroupGridLD || "0", 10);
    const newCount = currentCount + 1;

    db.prepare(
      `UPDATE GridLD SET  StatusGridLD = ?, GroupGridLD = ? WHERE LDPlayerGridLD = ?`,
    ).run(`สร้างกลุ่มสำเร็จ`, newCount.toString(), ldName);

    return true;
  } catch (error) {
    console.log(error);
    db.prepare(
      `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
    ).run("สร้างกลุ่มไม่สำเร็จ", ldName);
    return false;
  }
};

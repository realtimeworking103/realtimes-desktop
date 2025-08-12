import db from "../services/sqliteService.js";
import { loginWithAuthToken } from "@evex/linejs";
import { FileStorage } from "@evex/linejs/storage";
import { uploadImageWithHttps } from "../line-api/updateProfileGroup2.js";
import { addFriendByMid } from "../line-api/addFriendByMid.js";
import { getContactsV2 } from "../line-api/getContactsV2.js";

export const createChat = async ({
  ldName,
  accessToken,
  nameGroup,
  profile,
  oaId,
  message,
}: {
  ldName: string;
  accessToken: string;
  nameGroup: string;
  profile: string;
  oaId: string;
  message: string;
}): Promise<boolean> => {
  try {
    const client = await loginWithAuthToken(accessToken, {
      device: "IOS",
      storage: new FileStorage("./storage.json"),
    });

    const midSearchId = await client.base.talk.findContactByUserid({
      searchId: oaId,
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    addFriendByMid({
      accessToken,
      searchId: oaId,
      mid: midSearchId.mid,
    });

    getContactsV2({
      accessToken,
      mid: midSearchId.mid,
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

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

    await client.base.talk.sendMessage({
      to: responseChat.chat.chatMid,
      text: message,
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

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const row = db
      .prepare(`SELECT GroupGridLD FROM GridLD WHERE LDPlayerGridLD = ?`)
      .get(ldName) as { GroupGridLD: string };

    const currentCount = parseInt(row?.GroupGridLD || "0", 10);
    const newCount = currentCount + 1;

    db.prepare(
      `UPDATE GridLD SET  StatusGridLD = ?, GroupGridLD = ? WHERE LDPlayerGridLD = ?`,
    ).run(`สร้างกลุ่มสำเร็จ 1/1 กลุ่ม`, newCount.toString(), ldName);

    return true;
  } catch (error) {
    console.error("Create Chat Failed:", error);
    db.prepare(
      `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
    ).run(`สร้างกลุ่มไม่สำเร็จ`, ldName);
    return false;
  }
};

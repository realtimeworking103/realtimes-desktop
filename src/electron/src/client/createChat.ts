import db from "../services/sqliteService.js";
import { updateProfileCustom } from "../line/updateProfileCustom.js";
import { addFriendByMid } from "../line/addFriendByMid.js";
import { getContactsV2 } from "../line/getContactsV2.js";
import { loginWithAuthToken } from "@evex/linejs";
import { FileStorage } from "@evex/linejs/storage";
import UpdateStatus from "../services/updateStatus.js";

export const createChat = async ({
  ldName,
  accessToken,
  nameGroup,
  profile,
  searchId,
  message,
}: {
  ldName: string;
  accessToken: string;
  nameGroup: string;
  profile: string;
  searchId: string;
  message: string;
}): Promise<boolean> => {
  let client;
  try {
    client = await loginWithAuthToken(accessToken, {
      device: "IOS",
      version: "13.3.1",
      storage: new FileStorage("./storage.json"),
    });
  } catch (error: any) {
    console.error("Login Failed:", error);
    UpdateStatus.updateStatusLogin(ldName, `Login Failed`);
    return false;
  }

  let midSearchId: string;
  try {
    const contact = await client.base.talk.findContactByUserid({
      searchId: searchId,
    });
    midSearchId = contact.mid;
  } catch (error) {
    console.error("FindContact Failed:", error);
    UpdateStatus.updateStatusFindContactByUserid(ldName, `บัญชีติดบัค`);
    return false;
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    addFriendByMid({
      accessToken,
      searchId: searchId,
      mid: midSearchId,
    });
    getContactsV2({
      accessToken,
      mid: midSearchId,
    });
  } catch (error) {
    console.error("AddFriendByMid Failed:", error);
    UpdateStatus.updateStatusGetAllContactIds(ldName, `เพิ่มเพื่อนไม่สำเร็จ`);
    return false;
  }

  await new Promise((resolve) => setTimeout(resolve, 2000));

  let getAllContact: string[];
  try {
    getAllContact = await client.base.talk.getAllContactIds();
    if (!getAllContact.includes(midSearchId)) {
      UpdateStatus.updateStatusGetAllContactIds(ldName, `บัญชีติดบัค`);
      return false;
    }
  } catch (error: any) {
    console.error("getAllContactIds Failed:", error);
    return false;
  }

  let responseChat;
  try {
    responseChat = await client.base.talk.createChat({
      request: {
        reqSeq: 0,
        type: 1,
        name: nameGroup,
        targetUserMids: getAllContact,
        picturePath: "",
      },
    });
  } catch (error) {
    console.error("CreateChat Failed:", error);
    UpdateStatus.updateStatusResponseChat(
      ldName,
      `สร้างกลุ่มไม่สำเร็จ request block`,
    );
    return false;
  }

  try {
    await client.base.talk.sendMessage({
      to: responseChat.chat.chatMid,
      text: message,
    });

    let token = await client.base.talk.acquireEncryptedAccessToken({
      featureType: 2,
    });

    const match = token.toString().match(/TTJ[A-Za-z0-9+/=]+/);
    if (match) token = match[0];

    await updateProfileCustom({
      acquireToken: token,
      chatMid: responseChat.chat.chatMid,
      profile,
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const row = db
      .prepare(`SELECT GroupGridLD FROM GridLD WHERE LDPlayerGridLD = ?`)
      .get(ldName) as { GroupGridLD: string };

    const currentCount = parseInt(row?.GroupGridLD || "0", 10);
    const newCount = currentCount + 1;

    UpdateStatus.updateStatusCreateChat(
      ldName,
      `สร้างกลุ่มสำเร็จ ${newCount}/${newCount}`,
      newCount,
    );

    return true;
  } catch (error) {
    console.error("SendMessage/UploadImage Failed:", error);
    UpdateStatus.updateStatusSendMessage(
      ldName,
      `ส่งข้อความหรืออัปโหลดรูปไม่สำเร็จ`,
    );
    return false;
  }
};

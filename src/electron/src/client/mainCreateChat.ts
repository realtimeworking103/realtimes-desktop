import { loginWithAuthToken } from "@evex/linejs";
import { FileStorage } from "@evex/linejs/storage";
import { findContactByUserid } from "../line/findContactByUserid.js";
import { addFriendByMid } from "../line/addFriendByMid.js";
import { getContactsV2 } from "../line/getContactsV2.js";
import { createChatV1 } from "../line/createChatV1.js";
import { updateProfileCustom } from "../line/updateProfileCustom.js";
import UpdateStatus from "../services/updateStatus.js";

export const mainCreateChat = async ({
  ldName,
  accessToken,
  nameGroup,
  searchId,
  profile,
}: {
  ldName: string;
  accessToken: string;
  nameGroup: string;
  searchId: string;
  profile: string;
}): Promise<boolean> => {
  const client = await loginWithAuthToken(accessToken, {
    device: "IOS",
    version: "13.3.1",
    storage: new FileStorage("./storage.json"),
  });

  let midSearchId: string;
  try {
    midSearchId = await findContactByUserid(accessToken, searchId);
  } catch (error) {
    console.error("FindContact Failed:", error);
    return false;
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  let getAllContact: string[];
  try {
    getAllContact = await client.base.talk.getAllContactIds();
    if (!getAllContact.includes(midSearchId)) {
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
        UpdateStatus.updateStatusGetAllContactIds(
          ldName,
          `เพิ่มเพื่อนไม่สำเร็จ`,
        );
        return false;
      }
    }
    getAllContact = await client.base.talk.getAllContactIds();
  } catch (error) {
    console.error("getAllContactIds Failed:", error);
    return false;
  }

  let chatMid: string;
  try {
    chatMid = await createChatV1({
      accessToken,
      nameGroup,
      contactMids: getAllContact,
    });
  } catch (error) {
    console.error("CreateChatV1 Failed:", error);
    UpdateStatus.updateStatusGetAllContactIds(ldName, `สร้างกลุ่มไม่สำเร็จ`);
    return false;
  }

  try {
    let token = await client.base.talk.acquireEncryptedAccessToken({
      featureType: 2,
    });

    const match = token.toString().match(/TTJ[A-Za-z0-9+/=]+/);
    if (match) token = match[0];

    await updateProfileCustom({
      acquireToken: token,
      chatMid: chatMid,
      profile: profile,
    });
  } catch (error) {
    console.error("UpdateProfileCustom Failed:", error);
    return false;
  }
  return true;
};

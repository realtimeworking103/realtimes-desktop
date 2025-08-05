import { getAllContactIds } from "./getAllContactIds.js";
import { createChatWithProfileCustom } from "./createChatWithProfileCustom.js";
import { findContactByUseridOa } from "./function-addFriendOa.js";
import { syncContactsKai } from "./syncContactPhoneKai.js";

export async function createChatCustom({
  accessToken,
  ldName,
  nameGroup,
  profile,
  oaId,
  privateId,
}: {
  accessToken: string;
  nameGroup: string;
  ldName: string;
  profile: string;
  oaId: string;
  privateId: string;
}): Promise<boolean> {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const allContactMids: string[] = await getAllContactIds(accessToken);
      let privateMid: string | null = null;
      let oaMid: string | null = null;
      const isPrivateInContacts = allContactMids.includes(privateId);

      if (!isPrivateInContacts) {
        privateMid = await syncContactsKai(accessToken, [privateId]);
        console.log("ADD FRIEND PRIVATE MID:", privateMid);
      } else {
        privateMid = privateId;
      }

      const isOaInContacts = allContactMids.includes(oaId);

      if (!isOaInContacts) {
        oaMid = await findContactByUseridOa(accessToken, oaId);
        console.log("ADD FRIEND OA MID:", oaMid);
      } else {
        oaMid = oaId;
      }

      await createChatWithProfileCustom({
        accessToken,
        ldName,
        nameGroup,
        profile,
        midAdmin: [privateMid, oaMid],
      });
      resolve(true);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการสร้างกลุ่ม:", error);
      reject(error);
    }
  });
}

import { syncContactsKai } from "./syncContactPhoneKai.js";
import { findContactByUseridOa } from "./function-addFriendOa.js";
import { getAllContactIds } from "./getAllContactIds.js";
import { createChatWithProfileCustom } from "./createChatWithProfileCustom.js";

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
  privateId: string[];
}): Promise<boolean> {
  try {
    const privateMids = await syncContactsKai(accessToken, privateId);

    const oaMid = await findContactByUseridOa(accessToken, oaId);

    await getAllContactIds(accessToken);

    await createChatWithProfileCustom({
      accessToken,
      ldName,
      nameGroup,
      profile,
      midAdmin: [oaMid, privateMids],
    });

    return true;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการสร้างกลุ่ม:", error);
    return false;
  }
}

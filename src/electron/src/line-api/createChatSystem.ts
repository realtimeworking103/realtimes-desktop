import { syncContactsKai } from "./syncContactPhoneKai.js";
import { findContactByUseridOa } from "./function-addFriendOa.js";
import { createChatWithProfileSystem } from "./createChatWithProfileSystem.js";
import { getAllContactIds } from "./getAllContactIds.js";

export async function createChatSystem({
  accessToken,
  ldName,
  nameGroup,
  oaId,
  privateId,
}: {
  accessToken: string;
  nameGroup: string;
  ldName: string;
  oaId: string;
  privateId: string[];
}): Promise<boolean> {
  try {
    await syncContactsKai(accessToken, privateId);

    await findContactByUseridOa(accessToken, oaId);

    await getAllContactIds(accessToken);

    await createChatWithProfileSystem({ accessToken, ldName, nameGroup });

    return true;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการสร้างกลุ่ม:", error);
    return false;
  }
}

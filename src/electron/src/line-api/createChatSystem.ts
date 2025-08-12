import { getAllContactIds } from "./getAllContactIds.js";
import { findContactByUserid } from "./findContactByUserid.js";
import { syncContactsKai } from "./syncContactPhoneKai.js";
import { createChatWithProfileSystem } from "./createChatWithProfileSystem.js";

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
  privateId: string;
}): Promise<boolean> {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      await getAllContactIds(accessToken);

      const privateMid = await syncContactsKai(accessToken, [privateId]);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      // const oaMid = await findContactByUserid(accessToken, oaId);

      await new Promise((resolve) => setTimeout(resolve, 30000));

      await createChatWithProfileSystem({
        accessToken,
        ldName,
        nameGroup,
        midAdmin: [privateMid],
      });
      resolve(true);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการสร้างกลุ่ม:", error);
      reject(error);
    }
  });
}

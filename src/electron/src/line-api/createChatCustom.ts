import db from "../services/sqliteService.js";
import { createChatWithProfileCustom } from "./createChatWithProfileCustom.js";
import { syncContactsKai } from "./syncContactPhoneKai.js";
import { getAllContactIds } from "./getAllContactIds.js";
import { findContactByUserid } from "./findContactByUserid.js";

export async function createChatCustom({
  accessToken,
  ldName,
  nameGroup,
  oaId,
  privateId,
  profile,
}: {
  accessToken: string;
  ldName: string;
  nameGroup: string;
  oaId: string;
  privateId: string;
  profile: string;
}) {
  try {
    await getAllContactIds(accessToken);
    await new Promise((resolve) => setTimeout(resolve, 10000));
    const privateMid = await syncContactsKai(accessToken, [privateId]);
    await new Promise((resolve) => setTimeout(resolve, 10000));
    const oaMid = findContactByUserid({ accessToken, SearchId: oaId });
    await new Promise((resolve) => setTimeout(resolve, 10000));

    await createChatWithProfileCustom({
      accessToken,
      ldName,
      nameGroup,
      profile,
      midAdmin: [privateMid],
    });
    return true;
  } catch (error) {
    db.prepare(
      `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
    ).run("สร้างกลุ่มไม่สำเร็จ", ldName);
    return false;
  }
}

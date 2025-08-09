import db from "../services/sqliteService.js";
import { getAllContactIds } from "./getAllContactIds.js";
import { findContactByUseridOa } from "./function-addFriendOa.js";
import { getContactsV2 } from "./getContactsV2.js";
import { createChatWithProfileCustom } from "./createChatWithProfileCustom.js";
import { FileStorage } from "@evex/linejs/storage";
import { loginWithAuthToken } from "@evex/linejs";

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
    let oaMid: string | null = null;
    let privateMid: string | null = null;

    const client = await loginWithAuthToken(accessToken, {
      device: "IOS",
      storage: new FileStorage("./storage.json"),
    });

    const findContactByUserid = await client.base.talk.findContactByUserid({
      searchId: privateId,
    });

    privateMid = findContactByUserid.mid;
    await getContactsV2(accessToken, privateMid);

    oaMid = await findContactByUseridOa(accessToken, oaId);
    await getContactsV2(accessToken, oaMid);

    await getAllContactIds(accessToken);

    await createChatWithProfileCustom({
      accessToken,
      ldName,
      nameGroup,
      profile,
      midAdmin: [oaMid, privateMid],
    });
    return true;
  } catch (error) {
    db.prepare(
      `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
    ).run("สร้างกลุ่มไม่สำเร็จ", ldName);
    return false;
  }
}

import db from "../services/sqliteService.js";
import { createChatWithProfileCustom } from "./createChatWithProfileCustom.js";
import { syncContactsKai } from "./syncContactPhoneKai.js";
import { getAllContactIds } from "../line/getAllContactIds.js";
import { findContactByUserid } from "../line/findContactByUserid.js";
import { loginWithAuthToken } from "@evex/linejs";
import { FileStorage } from "@evex/linejs/storage";

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
  let client;

  try {
    client = await loginWithAuthToken(accessToken, {
      device: "IOS",
      storage: new FileStorage("./storage.json"),
    });
  } catch (error) {
    console.error("Login Failed:", error);
    db.prepare(
      `UPDATE GridLD SET StatusGridLD = ?, DateTimeGridLD = datetime('now', 'localtime') WHERE LDPlayerGridLD = ?`,
    ).run(`บัญชีติดบัค`, ldName);
    return false;
  }

  let privateMid;
  try {
    privateMid = await client.base.talk.findContactByUserid({
      searchId: privateId,
    });
  } catch (error) {
    console.error("FindContact Failed:", error);
    return false;
  }

  let oaMid;
  try {
    oaMid = await client.base.talk.findContactByUserid({
      searchId: oaId,
    });
  } catch (error) {
    console.error("FindContact Failed:", error);
    return false;
  }

  try {
    await getAllContactIds(accessToken);

    await createChatWithProfileCustom({
      accessToken,
      ldName,
      nameGroup,
      profile,
      midAdmin: [privateMid.mid, oaMid.mid],
    });
    return true;
  } catch (error) {
    db.prepare(
      `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
    ).run("สร้างกลุ่มไม่สำเร็จ", ldName);
    return false;
  }
}

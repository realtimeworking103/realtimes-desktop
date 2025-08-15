import { loginWithAuthToken } from "@evex/linejs";
import { FileStorage } from "@evex/linejs/storage";
import db from "../services/sqliteService.js";
import { addFriendByMid } from "../line/addFriendByMid.js";
import { getContactsV2 } from "../line/getContactsV2.js";
import { updateAccount } from "../services/accountService.js";

export const findAndAddFriend = async function ({
  accessToken,
  ldName,
  userId,
}: {
  accessToken: string;
  ldName: string;
  userId: string;
}) {
  const client = await loginWithAuthToken(accessToken, {
    device: "IOS",
    storage: new FileStorage("./storage.json"),
  });

  try {
    const midSearchId = await client.base.talk.findContactByUserid({
      searchId: userId,
    });

    console.log("midSearchId", midSearchId.displayName, midSearchId.mid);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    addFriendByMid({
      accessToken,
      searchId: userId,
      mid: midSearchId.mid,
    });

    getContactsV2({
      accessToken,
      mid: midSearchId.mid,
    });

    db.prepare(
      `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
    ).run(`เพิ่มเพื่อน ${midSearchId.displayName} สำเร็จ`, ldName);

    updateAccount({
      name: userId,
      type: "ไลน์บอท",
      mid: midSearchId.mid,
      status: true,
    });

    return true;
  } catch (error) {
    db.prepare(
      `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
    ).run("เพิ่มเพื่อนไม่สำเร็จ", ldName);
    return false;
  }
};

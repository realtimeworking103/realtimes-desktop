import { loginWithAuthToken } from "@evex/linejs";
import { FileStorage } from "@evex/linejs/storage";
import db from "../services/sqliteService.js";
import { addFriendById } from "./addFriendById.js";

export const addMe = async function ({
  accessToken,
  ldName,
  phone,
  userId,
}: {
  accessToken: string;
  ldName: string;
  phone: string;
  userId: string;
}) {
  const client = await loginWithAuthToken(accessToken, {
    device: "IOS",
    storage: new FileStorage("./storage.json"),
  });

  const getProfile = await client.base.talk.getProfile();

  try {
    await client.base.talk.getRecentFriendRequests({
      syncReason: 0,
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const midUserId = await client.base.talk.findContactByUserid({
      searchId: userId,
    });

    console.log("midUserId", midUserId.mid);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    addFriendById({
      accessToken,
      userId,
      midUserId: midUserId.mid,
    });

    await client.base.talk.getContactsV2({
      mids: [getProfile.mid],
    });

    return true;
  } catch (error) {
    db.prepare(
      `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
    ).run("แอดเพื่อนไม่สำเร็จ", ldName);
    return false;
  }
};

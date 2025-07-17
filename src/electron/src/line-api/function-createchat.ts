import { syncContactsKai } from "./syncContactPhoneKai.js";
import { findContactByUseridOa } from "./function-addFriendOa.js";
import { createGroup } from "./createChat.js";
import { getAllContactIds } from "./getAllContactIds.js";

export async function mainCreateGroup({
  accessToken,
  nameGroup,
  ldName,
  oaId,
  privateId,
}: {
  accessToken: string;
  nameGroup: string;
  ldName: string;
  oaId: string;
  privateId: string;
}): Promise<boolean> {
  try {
    await syncContactsKai(accessToken, [privateId]);
    await findContactByUseridOa(accessToken, oaId);

    await getAllContactIds(accessToken);
    await createGroup({ accessToken, nameGroup, ldName });

    return true;
  } catch (err) {
    return false;
  }
}

import { syncContactsKai } from "./function-addFriendKai.js";
import { addKaiOa } from "./function-addFriendOa.js";
import { createGroup } from "./function-creategroup.js";
import { findMidsByPhone } from "./function-findMidByPhone.js";
import { getContact } from "./function-getcontact.js";
import { findMidsById } from "./functon-findcontacts.js";

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
    await addKaiOa(accessToken, oaId);

    await getContact(accessToken);
    await createGroup({ accessToken, nameGroup, ldName });

    return true;
  } catch (err) {
    return false;
  }
}

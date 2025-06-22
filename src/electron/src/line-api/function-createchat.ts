import { syncContactsKai } from "./function-addFriendKai.js";
import { addKaiOa } from "./function-addFriendOa.js";
import { createGroup } from "./function-creategroup.js";
import { getContact } from "./function-getcontact.js";
import { findMidsById } from "./functon-findcontacts.js";

export async function mainCreateGroup(params: {
  accessToken: string;
  nameGroup: string;
  ldName: string;
  // phones: string[];
  // oaId: string;
}) {
  const { accessToken, nameGroup, ldName } = params;

  // for (const phone of phones) {
  //   await syncContactsKai(accessToken, [phone]);
  // }
  // const idsToFind = [...phones, oaId];

  await addKaiOa(accessToken, "@413jtmca");
  await findMidsById(accessToken, ["@413jtmca", "kaineko2206"]);
  await getContact(accessToken);
  await createGroup({ accessToken, nameGroup, ldName });
}

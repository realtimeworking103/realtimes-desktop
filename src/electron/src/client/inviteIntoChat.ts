import { loginWithAuthToken } from "@evex/linejs";
import { FileStorage } from "@evex/linejs/storage";
import { uploadImageWithHttps } from "../line-api/updateProfileGroup2.js";

export async function inviteIntoChats({
  ldName,
  accessToken,
  nameGroup,
  profile,
  oaId,
  privateId,
  message,
}: {
  ldName: string;
  accessToken: string;
  nameGroup: string;
  profile: string;
  oaId: string;
  privateId: string;
  message: string;
}) {
  console.log(ldName);
  console.log(oaId);
  console.log(privateId);

  try {
    const client = await loginWithAuthToken(accessToken, {
      device: "IOS",
      version: "13.1.1",
      storage: new FileStorage("./storage.json"),
    });

    const getprofile = await client.base.talk.getProfile();

    const responseChat = await client.base.talk.createChat({
      request: {
        reqSeq: 0,
        type: 1,
        name: nameGroup,
        targetUserMids: [getprofile.mid],
        picturePath: "",
      },
    });

    let token = await client.base.talk.acquireEncryptedAccessToken({
      featureType: 2,
    });

    const pattern3 = /TTJ[A-Za-z0-9+/=]+/;
    const match = token.toString().match(pattern3);
    if (match) {
      const result = match[0];
      token = result;
    }

    await uploadImageWithHttps(responseChat.chat.chatMid, token, profile);

    const getAllContactIds = await client.base.talk.getAllContactIds();

    await client.base.talk.inviteIntoChat({
      chatMid: responseChat.chat.chatMid,
      targetUserMids: getAllContactIds,
    });

    await client.base.talk.sendMessage({
      to: responseChat.chat.chatMid,
      text: message,
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

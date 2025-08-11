import { loginWithAuthToken } from "@evex/linejs";
import { FileStorage } from "@evex/linejs/storage";

export const checkAccount = async (
  accessToken: string,
): Promise<{
  getAllContactIds: number;
  getAllChatMids: number;
}> => {
  const client = await loginWithAuthToken(accessToken, {
    device: "IOS",
    storage: new FileStorage("./storage.json"),
  });

  const getAllContactIds = await client.base.talk.getAllContactIds();

  const getAllChatMids = await client.base.talk.getAllChatMids({
    syncReason: "INTERNAL",
    request: {
      withInvitedChats: true,
      withMemberChats: true,
    },
  });

  return {
    getAllContactIds: getAllContactIds.length,
    getAllChatMids: getAllChatMids.memberChatMids.length,
  };
};

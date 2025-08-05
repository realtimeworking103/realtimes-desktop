const electron = require("electron");

// Expose type-safe API to renderer
electron.contextBridge.exposeInMainWorld("electron", {
  statistics: (callback: (stats: Statistics) => void) =>
    ipcOn("statistics", callback),
  test: (callback: (stats: any) => void) => ipcOn("test", callback),
  getStaticData: () => ipcInvoke("getStaticData"),
  getLDPlayersDB: () => ipcInvoke("getLDPlayersDB"),
  callLdInstance: (payload) => ipcInvoke("callLdInstance", payload),
  deleteLdInstance: (payload) => ipcInvoke("deleteLdInstance", payload),
  deleteRowFromDB: (payload) => ipcInvoke("deleteRowFromDB", payload),
  getTokenLdInstance: (payload) => ipcInvoke("getTokenLdInstance", payload),
  fetchLdInstance: () => ipcInvoke("fetchLdInstance"),
  getDataCreateLDPlayers: () => ipcInvoke("getDataCreateLDPlayers"),
  createLdInstance: (payload: { prefix: string; count: number }) =>
    ipcInvoke("createLdInstance", payload),
  moveSelectedLDPlayers: (payload) =>
    ipcInvoke("moveSelectedLDPlayers", payload),
  setLdInstancePath: (payload: string) =>
    ipcInvoke("setLdInstancePath", payload),
  getLdInstancePath: () => ipcInvoke("getLdInstancePath"),
  browseLdInstancePath: () => ipcInvoke("browseLdInstancePath"),
  checkBanLdInstance: (payload: { ldName: string; accessToken: string }) =>
    ipcInvoke("checkBanLdInstance", payload),
  getTxtFiles: () => ipcInvoke("getTxtFiles"),
  saveTxtFile: (payload: { name: string; count: number; path: string }) =>
    ipcInvoke("saveTxtFile", payload),
  deleteTxtFile: (payload: number) => ipcInvoke("deleteTxtFile", payload),
  updatePhoneFile: (payload: { ldName: string; fileName: string }) =>
    ipcInvoke("updatePhoneFile", payload),

  addFriends: (payload: {
    ldName: string;
    accessToken: string;
    target: number;
    phoneFile: string;
  }) => ipcInvoke("addFriends", payload),

  createChatSystem: (payload: {
    accessToken: string;
    ldName: string;
    nameGroup: string;
    oaId: string;
    privateId: string;
  }) => ipcInvoke("createChatSystem", payload),

  createChatCustom: (payload: {
    accessToken: string;
    ldName: string;
    nameGroup: string;
    profile: string;
    oaId: string;
    privateId: string;
  }) => ipcInvoke("createChatCustom", payload),

  selectTextFile: () => ipcInvoke("selectTextFile"),
  selectImageFile: () => ipcInvoke("selectImageFile"),
  getAccount: () => ipcInvoke("getAccount"),
  addAccount: (payload: {
    type: string;
    name: string;
    status: boolean;
    mid: string;
  }) => ipcInvoke("addAccount", payload),
  deleteAccount: (payload: string) => ipcInvoke("deleteAccount", payload),
  updateAccount: (payload: {
    name: string;
    type: string;
    mid: string;
    status: boolean;
  }) => ipcInvoke("updateAccount", payload),
  selectFileNameGroup: () => ipcInvoke("selectFileNameGroup"),
  getFileNameGroup: () => ipcInvoke("getFileNameGroup"),
  deleteNameGroup: (payload: number) => ipcInvoke("deleteNameGroup", payload),
  addNameGroup: (payload: { name: string; description: string }) =>
    ipcInvoke("addNameGroup", payload),
  editNameGroup: (payload: { id: number; name: string; description: string }) =>
    ipcInvoke("editNameGroup", payload),
  getProfile: () => ipcInvoke("getProfile"),
  deleteProfile: (payload: string) => ipcInvoke("deleteProfile", payload),

  inviteIntoChats: (payload: {
    ldName: string;
    accessToken: string;
    profile: string;
    nameGroup: string;
    oaId: string;
    privateId: string;
    message: string;
  }) => ipcInvoke("inviteIntoChats", payload),

  addMessage: (payload: { nameMessage: string; message: string }) =>
    ipcInvoke("addMessage", payload),
  deleteMessage: (payload: number) => ipcInvoke("deleteMessage", payload),
  getMessage: () => ipcInvoke("getMessage"),
  editMessage: (payload: {
    id: number;
    nameMessage: string;
    message: string;
  }) => ipcInvoke("editMessage", payload),

  login: (payload: { username: string; password: string }) =>
    ipcInvoke("login", payload),
  logout: (payload: { sessionId: string; userId: string }) =>
    ipcInvoke("logout", payload),
} satisfies Window["electron"]);

// Type-safe IPC communication functions
function ipcInvoke<T extends IpcEventKey>(
  key: T,
  payload?: IpcEventPayload<T>,
): Promise<IpcEventResponse<T>> {
  return electron.ipcRenderer.invoke(key, payload);
}

function ipcOn<T extends IpcEventKey>(
  key: T,
  callback: (payload: IpcEventPayload<T>) => void,
): UnsubscribeFunction {
  const cb = (_: Electron.IpcRendererEvent, payload: IpcEventPayload<T>) =>
    callback(payload);
  electron.ipcRenderer.on(key, cb);
  return () => electron.ipcRenderer.off(key, cb);
}

// Send event to main
// function ipcSend<Key extends keyof EventPayloadMapping>(
//   key: Key,
//   payload: EventPayloadMapping[Key],
// ) {
//   electron.ipcRenderer.send(key, payload);
// }

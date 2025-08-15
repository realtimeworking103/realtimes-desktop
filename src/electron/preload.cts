const electron = require("electron");

// Expose type-safe API to renderer
electron.contextBridge.exposeInMainWorld("electron", {
  // Event Listeners
  statistics: (callback: (stats: Statistics) => void) => ipcOn("statistics", callback),
  test: (callback: (stats: any) => void) => ipcOn("test", callback),

  // LDPlayer Management
  browseLdInstancePath: () => ipcInvoke("browseLdInstancePath"),
  callLdInstance: (payload) => ipcInvoke("callLdInstance", payload),
  checkBanLdInstance: (payload: { ldName: string; accessToken: string }) => ipcInvoke("checkBanLdInstance", payload),
  createLdInstance: (payload: { prefix: string; count: number }) => ipcInvoke("createLdInstance", payload),
  deleteLdInstance: (payload) => ipcInvoke("deleteLdInstance", payload),
  fetchLdInstance: () => ipcInvoke("fetchLdInstance"),
  getDataCreateLDPlayers: () => ipcInvoke("getDataCreateLDPlayers"),
  getLDPlayersDB: () => ipcInvoke("getLDPlayersDB"),
  getLdInstancePath: () => ipcInvoke("getLdInstancePath"),
  getTokenLdInstance: (payload) => ipcInvoke("getTokenLdInstance", payload),
  moveSelectedLDPlayers: (payload) => ipcInvoke("moveSelectedLDPlayers", payload),
  setLdInstancePath: (payload: string) => ipcInvoke("setLdInstancePath", payload),

  // Database Management
  deleteRowFromDB: (payload) => ipcInvoke("deleteRowFromDB", payload),
  getStaticData: () => ipcInvoke("getStaticData"),

  // Friends Management
  addFriends: (payload: { ldName: string; accessToken: string; target: number; phoneFile: string; privatePhone: string; }) => ipcInvoke("addFriends", payload),
  findAndAddFriend: (payload: { accessToken: string; ldName: string; userId: string }) => ipcInvoke("findAndAddFriend", payload),

  // Chat Management
  createChat: (payload: { accessToken: string; ldName: string; nameGroup: string; profile: string; searchId: string; message: string; }) => ipcInvoke("createChat", payload),
  mainCreateChat: (payload: { ldName: string; accessToken: string; nameGroup: string; searchId: string; profile: string; }) => ipcInvoke("mainCreateChat", payload),
  createChatCustom: (payload: { accessToken: string; ldName: string; nameGroup: string; profile: string; oaId: string; privateId: string; }) => ipcInvoke("createChatCustom", payload),
  createChatSystem: (payload: { accessToken: string; ldName: string; nameGroup: string; oaId: string; privateId: string; }) => ipcInvoke("createChatSystem", payload),
  inviteIntoChats: (payload: { ldName: string; accessToken: string; profile: string; nameGroup: string; oaId: string; privateId: string; message: string; }) => ipcInvoke("inviteIntoChats", payload),

  // File Management
  deleteTxtFile: (payload: number) => ipcInvoke("deleteTxtFile", payload),
  getTxtFiles: () => ipcInvoke("getTxtFiles"),
  saveTxtFile: (payload: { name: string; count: number; path: string }) => ipcInvoke("saveTxtFile", payload),
  selectImageFile: () => ipcInvoke("selectImageFile"),
  selectTextFile: () => ipcInvoke("selectTextFile"),
  updatePhoneFile: (payload: { ldName: string; fileName: string }) => ipcInvoke("updatePhoneFile", payload),

  // Account Management
  addAccount: (payload: { type: string; name: string; status: boolean; mid: string; }) => ipcInvoke("addAccount", payload),
  deleteAccount: (payload: string) => ipcInvoke("deleteAccount", payload),
  getAccount: () => ipcInvoke("getAccount"),
  updateAccount: (payload: { name: string; type: string; mid: string; status: boolean; }) => ipcInvoke("updateAccount", payload),

  // Credentials Management
  deleteRememberedCredentials: () => ipcInvoke("deleteRememberedCredentials"),
  getRememberedCredentials: () => ipcInvoke("getRememberedCredentials"),
  saveRememberedCredentials: (payload: { username: string; password: string }) => ipcInvoke("saveRememberedCredentials", payload),

  // NameGroup Management
  addNameGroup: (payload: { name: string; description: string }) => ipcInvoke("addNameGroup", payload),
  deleteNameGroup: (payload: number) => ipcInvoke("deleteNameGroup", payload),
  editNameGroup: (payload: { id: number; name: string; description: string }) => ipcInvoke("editNameGroup", payload),
  getFileNameGroup: () => ipcInvoke("getFileNameGroup"),
  selectFileNameGroup: () => ipcInvoke("selectFileNameGroup"),

  // Profile Management
  deleteProfile: (payload: string) => ipcInvoke("deleteProfile", payload),
  getProfile: () => ipcInvoke("getProfile"),

  // Message Management
  addMessage: (payload: { nameMessage: string; message: string }) => ipcInvoke("addMessage", payload),
  deleteMessage: (payload: number) => ipcInvoke("deleteMessage", payload),
  editMessage: (payload: { id: number; nameMessage: string; message: string }) => ipcInvoke("editMessage", payload),
  getMessage: () => ipcInvoke("getMessage"),

  // Auth
  login: (payload: { username: string; password: string }) => ipcInvoke("login", payload),
  logout: (payload: { sessionId: string; userId: string }) => ipcInvoke("logout", payload),

  // Status Management
  addStatus: (payload: string) => ipcInvoke("addStatus", payload),
  deleteStatus: (payload: number) => ipcInvoke("deleteStatus", payload),
  getStatus: () => ipcInvoke("getStatus"),
  updateStatus: (payload: { id: number; status: string }) => ipcInvoke("updateStatus", payload),
  updateStatusLDPlayer: (payload: { id: number; status: string }) => ipcInvoke("updateStatusLDPlayer", payload),

  // Version Management
  addAvailableVersion: (payload: string) => ipcInvoke("addAvailableVersion", payload),
  getVersionData: () => ipcInvoke("getVersionData"),
  removeAvailableVersion: (payload: string) => ipcInvoke("removeAvailableVersion", payload),
  updateCurrentVersion: (payload: string) => ipcInvoke("updateCurrentVersion", payload),
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

const electron = require("electron");

// Expose type-safe API to renderer
electron.contextBridge.exposeInMainWorld("electron", {
  statistics: (callback: (stats: Statistics) => void) =>
    ipcOn("statistics", callback),

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

  setLDPlayerPath: (payload) => ipcInvoke("setLDPlayerPath", payload),
  getLDPlayerPath: () => ipcInvoke("getLDPlayerPath"),

  checkBanLdInstance: (payload: { ldName: string; accessToken: string }) =>
    ipcInvoke("checkBanLdInstance", payload),

  getTxtFiles: () => ipcInvoke("getTxtFiles"),
  saveTxtFile: (payload: { name: string; count: number; path: string }) =>
    ipcInvoke("saveTxtFile", payload),
  deleteTxtFile: (fileName: string) => ipcInvoke("deleteTxtFile", fileName),

  updatePhoneFile: (payload: { ldName: string; fileName: string }) =>
    ipcInvoke("updatePhoneFile", payload),

  getAccountLineId: () => ipcInvoke("getAccountLineId"),
  addAccountLineId: (payload: { lineId: string; type: string }) =>
    ipcInvoke("addAccountLineId", payload),
  deleteAccountLineId: (payload) => ipcInvoke("deleteAccountLineId", payload),

  addFriends: (payload: {
    ldName: string;
    accessToken: string;
    target: number;
    phoneFile: string;
  }) => ipcInvoke("addFriends", payload),

  mainCreateGroup: (payload: {
    accessToken: string;
    ldName: string;
    nameGroup: string;
    oaId: string;
    privateId: string;
  }) => ipcInvoke("mainCreateGroup", payload),

  selectTextFile: () => ipcInvoke("selectTextFile"),

  getImageProfile: () => ipcInvoke("getImageProfile"),
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

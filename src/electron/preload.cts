const electron = require("electron");

// Expose type-safe API to renderer
electron.contextBridge.exposeInMainWorld("electron", {
  statistics: (callback: (stats: Statistics) => void) => ipcOn("statistics", callback),
  getStaticData: () => ipcInvoke("getStaticData"),
  getLDPlayersDB: () => ipcInvoke("getLDPlayersDB"),
  callLdInstance: (payload) => ipcInvoke("callLdInstance", payload),
  deleteLdInstance: (payload) => ipcInvoke("deleteLdInstance", payload),
  deleteRowFromDB: (payload) => ipcInvoke("deleteRowFromDB", payload),
  pullDBLdInstanceAuto: (payload) => ipcInvoke("pullDBLdInstanceAuto", payload),
  pullDBLdInstanceManual: (payload) => ipcInvoke("pullDBLdInstanceManual", payload),
  fetchLdInstance: () => ipcInvoke("fetchLdInstance"),
  getDataCreateLDPlayers: () => ipcInvoke("getDataCreateLDPlayers"),
  createLDPlayers: (payload: { prefix: string; count: number }) => ipcInvoke("createLDPlayers", payload),
  moveSelectedLDPlayers: (payload) => ipcInvoke("moveSelectedLDPlayers", payload),
  setLDPlayerPath: (payload) => ipcInvoke("setLDPlayerPath", payload),
  getLDPlayerPath: () => ipcInvoke("getLDPlayerPath"),
  createGroup: (payload: { ldName: string; accessToken: string }) => ipcInvoke("createGroup", payload),
  checkBanLdInstance: (payload: { ldName: string; accessToken: string }) => ipcInvoke("checkBanLdInstance", payload),
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

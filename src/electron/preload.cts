const electron = require("electron");

// Expose type-safe API to renderer
electron.contextBridge.exposeInMainWorld("electron", {
  statistics: (callback: (stats: Statistics) => void) =>
    ipcOn("statistics", callback),
  getStaticData: () => ipcInvoke("getStaticData"),
  getLDPlayersDB: () => ipcInvoke("getLDPlayersDB"),
  callLdInstance: (ldName) => ipcInvoke("callLdInstance", ldName),
  deleteLdInstance: (ldName) => ipcInvoke("deleteLdInstance", ldName),
  deleteRowFromDB: (ldName) => ipcInvoke("deleteRowFromDB", ldName),
  pullDBLdInstance: (ldName) => ipcInvoke("pullDBLdInstance", ldName),
  pullDBLdInstance2: (ldName) => ipcInvoke("pullDBLdInstance2", ldName),
  fetchLdInstance: () => ipcInvoke("fetchLdInstance"),
  getDataCreateLDPlayers: () => ipcInvoke("getDataCreateLDPlayers"),
  createLDPlayers: (payload: { prefix: string; count: number }) =>
    ipcInvoke("createLDPlayers", payload),
  moveSelectedLDPlayers: (names) => ipcInvoke("moveSelectedLDPlayers", names),
  setLDPlayerPath: (path) => ipcInvoke("setLDPlayerPath", path),
  getLDPlayerPath: () => ipcInvoke("getLDPlayerPath"),
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

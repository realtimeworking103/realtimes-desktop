const electron = require("electron");

// Expose type-safe API to renderer
electron.contextBridge.exposeInMainWorld("electron", {
  statistics: (callback: (stats: Statistics) => void) =>
    ipcOn("statistics", callback),
  getStaticData: () => ipcInvoke("getStaticData"),
  getLDPlayersDB: () => ipcInvoke("getLDPlayersDB"),
  callLdInstance: (ldName: string) => ipcInvoke("callLdInstance", ldName),
  deleteLdInstance: (ldName: string) => ipcInvoke("deleteLdInstance", ldName),
  deleteRowFromDB: (id: number) => ipcInvoke("deleteRowFromDB", id),
  pullDBLdInstance: (ldName: string) => ipcInvoke("pullDBLdInstance", ldName),
  fetchLdInstance: () => ipcInvoke("fetchLdInstance"),
  getDataCreateLDPlayers: () => ipcInvoke("getDataCreateLDPlayers"),
  createLDPlayers: (payload: { prefix: string; count: number }) =>
    ipcInvoke("createLDPlayers", payload),
  moveSelectedLDPlayers: (names: string[]) =>
    ipcInvoke("moveSelectedLDPlayers", names),
  setLDPlayerPath: (path: string) => ipcInvoke("setLDPlayerPath", path),
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

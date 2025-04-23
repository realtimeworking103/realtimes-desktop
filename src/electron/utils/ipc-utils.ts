import { ipcMain, WebContents, WebFrameMain } from "electron";
import { isDev } from "./is-dev.js";
import { getUIPath } from "./path-resolver.js";
import { pathToFileURL } from "url";

export function ipcMainHandle<T extends IpcEventKey>(
  key: T,
  handler: (payload: IpcEventPayload<T>) => IpcEventResponse<T>,
) {
  ipcMain.handle(key, (event, payload) => {
    validateEventFrame(event.senderFrame as WebFrameMain);
    return handler(payload);
  });
}

// ipcOn is for frontend to listen to events
// ipcMainOn is for backend to listen to events
export function ipcMainOn<T extends IpcEventKey>(
  key: T,
  handler: (payload: IpcEventPayload<T>) => void,
) {
  ipcMain.on(key, (event, payload) => {
    validateEventFrame(event.senderFrame as WebFrameMain);
    return handler(payload);
  });
}

export function ipcWebContentsSend<T extends IpcEventKey>(
  key: T,
  webContents: WebContents,
  payload: IpcEventPayload<T>,
) {
  webContents.send(key, payload);
}

export function validateEventFrame(frame: WebFrameMain) {
  if (isDev() && new URL(frame.url).host === "localhost:5173") {
    return;
  }

  if (frame.url !== pathToFileURL(getUIPath()).toString()) {
    throw new Error("Malicious event");
  }
}

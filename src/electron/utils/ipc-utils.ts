import { ipcMain, WebContents, WebFrameMain } from "electron";
import { isDev } from "./is-dev.js";
import { getUIPath } from "./path-resolver.js";
import { pathToFileURL } from "url";

export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: (payload: EventPayloadMapping[Key]) => EventPayloadMapping[Key],
) {
  ipcMain.handle(key, (event, payload) => {
    validateEventFrame(event.senderFrame as WebFrameMain);
    return handler(payload);
  });
}

export function ipcMainOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: (payload: EventPayloadMapping[Key]) => void,
) {
  ipcMain.on(key, (event, payload) => {
    validateEventFrame(event.senderFrame as WebFrameMain);
    return handler(payload);
  });
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  webContents: WebContents,
  payload: EventPayloadMapping[Key],
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

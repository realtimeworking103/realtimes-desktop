import { BrowserWindow } from "electron";
import { ipcMainHandle } from "../utils/ipc-utils.js";
import { getStatisData, pollResources } from "./resource-manager.js";

export default function initMain(mainWindow: BrowserWindow) {
  ipcMainHandle("getStaticData", getStatisData);
  ipcMainHandle("callLdInstance", (payload) => callLdInstance(payload));
  pollResources(mainWindow);
}

function callLdInstance(payload: number) {
  console.log(payload);

  return payload;
}

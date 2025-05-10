import { BrowserWindow } from "electron";
import { ipcMainHandle } from "../utils/ipc-utils.js";
import { getStatisData, pollResources } from "./resource-manager.js";
import {
  getLDPlayersDB,
  deleteRowFromDB,
  getDataCreateLDPlayers,
  moveSelectedLDPlayers,
  setLDPlayerPath,
  getLDPlayerPath,
} from "./function-db.js";

import {
  callLdInstance,
  deleteLdInstance,
  pullDBLdInstance,
  fetchLdInstance,
  createLDPlayers,
} from "./function-ldplayer.js";

export default function initMain(mainWindow: BrowserWindow) {
  pollResources(mainWindow);
  ipcMainHandle("getStaticData", getStatisData);
  ipcMainHandle("getLDPlayersDB", getLDPlayersDB);
  ipcMainHandle("callLdInstance", callLdInstance);
  ipcMainHandle("deleteLdInstance", deleteLdInstance);
  ipcMainHandle("deleteRowFromDB", deleteRowFromDB);
  ipcMainHandle("fetchLdInstance", fetchLdInstance);
  ipcMainHandle("pullDBLdInstance", pullDBLdInstance);
  ipcMainHandle("getDataCreateLDPlayers", getDataCreateLDPlayers);
  ipcMainHandle("createLDPlayers", createLDPlayers);
  ipcMainHandle("moveSelectedLDPlayers", moveSelectedLDPlayers);
  ipcMainHandle("setLDPlayerPath", setLDPlayerPath);
  ipcMainHandle("getLDPlayerPath", getLDPlayerPath);
}

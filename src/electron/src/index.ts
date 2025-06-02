import { BrowserWindow } from "electron";
import { ipcMainHandle } from "../utils/ipc-utils.js";
import { getStatisData, pollResources } from "./resource-manager.js";

import {
  callLdInstance,
  deleteLdInstance,
  fetchLdInstance,
  createLDPlayers,
} from "./function-ldplayer.js";

import { getLDPlayersDB, getCreateLDPlayersDB } from "./db-getLdplayer.js";
import { setLDPlayerPath, getLDPlayerPath } from "./db-pathLd.js";
import { deleteRowFromDB, moveSelectedLDPlayers } from "./function-db.js";
import { pullDBLdInstance, pullDBLdInstance2 } from "./function-pulldatabase.js";
import "./function-createldplayer.js";

export default function initMain(mainWindow: BrowserWindow) {
  pollResources(mainWindow);
  ipcMainHandle("getStaticData", getStatisData);
  ipcMainHandle("getLDPlayersDB", getLDPlayersDB);
  ipcMainHandle("callLdInstance", callLdInstance);
  ipcMainHandle("deleteLdInstance", deleteLdInstance);
  ipcMainHandle("deleteRowFromDB", deleteRowFromDB);
  ipcMainHandle("fetchLdInstance", fetchLdInstance);
  ipcMainHandle("pullDBLdInstance", pullDBLdInstance);
  ipcMainHandle("pullDBLdInstance2", pullDBLdInstance2);
  ipcMainHandle("getDataCreateLDPlayers", getCreateLDPlayersDB);
  ipcMainHandle("createLDPlayers", createLDPlayers);
  ipcMainHandle("moveSelectedLDPlayers", moveSelectedLDPlayers);
  ipcMainHandle("setLDPlayerPath", setLDPlayerPath);
  ipcMainHandle("getLDPlayerPath", getLDPlayerPath);
}

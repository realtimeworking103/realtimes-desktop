import { BrowserWindow } from "electron";
import { ipcMainHandle } from "../utils/ipc-utils.js";
import { getStatisData, pollResources } from "./resource-manager.js";

import {
  callLdInstance,
  deleteLdInstance,
  fetchLdInstance,
  createLdInstance,
} from "./function-ldplayer.js";

import { getLDPlayersDB, getCreateLDPlayersDB } from "./db-getLdplayer.js";
import { setLDPlayerPath, getLDPlayerPath } from "./db-pathLd.js";
import {
  addAccountLineId,
  deleteAccountLineId,
  deleteRowFromDB,
  getAccountLineId,
  moveSelectedLDPlayers,
  updatePhoneFile,
} from "./function-db.js";
import { getTokenLdInstance } from "./function-pulldatabase.js";
import { checkBanLdInstance } from "./line-api/function-checkban.js";
import { mainCreateGroup } from "./line-api/function-createchat.js";
import {
  getTxtFiles,
  saveTxtFile,
  deleteTxtFile,
} from "./function-filemanager.js";
import { addFriends } from "./line-api/function-addfriends.js";

export default function initMain(mainWindow: BrowserWindow) {
  pollResources(mainWindow);
  ipcMainHandle("getStaticData", getStatisData);

  ipcMainHandle("setLDPlayerPath", setLDPlayerPath);
  ipcMainHandle("getLDPlayerPath", getLDPlayerPath);

  ipcMainHandle("getDataCreateLDPlayers", getCreateLDPlayersDB);
  ipcMainHandle("createLdInstance", createLdInstance);
  ipcMainHandle("moveSelectedLDPlayers", moveSelectedLDPlayers);

  ipcMainHandle("getLDPlayersDB", getLDPlayersDB);
  ipcMainHandle("callLdInstance", callLdInstance);
  ipcMainHandle("deleteLdInstance", deleteLdInstance);
  ipcMainHandle("deleteRowFromDB", deleteRowFromDB);
  ipcMainHandle("fetchLdInstance", fetchLdInstance);

  ipcMainHandle("getTokenLdInstance", getTokenLdInstance);

  ipcMainHandle("getTxtFiles", getTxtFiles);
  ipcMainHandle("saveTxtFile", saveTxtFile);
  ipcMainHandle("deleteTxtFile", deleteTxtFile);
  ipcMainHandle("updatePhoneFile", updatePhoneFile);

  ipcMainHandle("addAccountLineId", addAccountLineId);
  ipcMainHandle("getAccountLineId", getAccountLineId);
  ipcMainHandle("deleteAccountLineId", deleteAccountLineId);

  ipcMainHandle("addFriends", addFriends);
  ipcMainHandle("mainCreateGroup", mainCreateGroup);
  ipcMainHandle("checkBanLdInstance", checkBanLdInstance);
}

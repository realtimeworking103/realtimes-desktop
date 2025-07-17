import { BrowserWindow } from "electron";
import { ipcMainHandle } from "../utils/ipc-utils.js";
import { getStatisData, pollResources } from "./resource-manager.js";

import { setLDPlayerPath } from "./services/ldplayer/setLdInstancePath.js";
import { getLDPlayerPath } from "./services/ldplayer/getLdInstancePath.js";
import { createLdInstance } from "./services/ldplayer/createLdInstace.js";
import { moveLdInstace } from "./services/ldplayer/moveLdInstace.js";
import { callLdInstance } from "./services/ldplayer/callLdInstance.js";
import { deleteLdInstance } from "./services/ldplayer/deleteLdInstance.js";
import { deleteRowFromDB } from "./services/ldplayer/delteRowLdInstace.js";
import { fetchLdInstance } from "./services/ldplayer/fetchLdInstance.js";
import { getTokenLdInstance } from "./services/ldplayer/getTokenLdInstance.js";
import { getTableCreateLdInstance } from "./services/ldplayer/getTableCreateLdInstance.js";
import { getLdInstance } from "./services/ldplayer/getLdInstance.js";
import { addFriends } from "./line-api/function-addfriends.js";
import { checkBanLdInstance } from "./line-api/function-checkban.js";
import { mainCreateGroup } from "./line-api/function-createchat.js";

import {
  addLineKai,
  deleteLineKai,
  getTableDataLineKai,
} from "./services/sqlite/dataLineKai.js";

import {
  deleteTxtFile,
  getTxtFiles,
  saveTxtFile,
  selectTextFile,
} from "./services/fileService.js";

import { updatePhoneFile } from "./function-db.js";
import { getImageProfile } from "./services/profileService.js";

export default function initMain(mainWindow: BrowserWindow) {
  pollResources(mainWindow);
  ipcMainHandle("getStaticData", getStatisData);

  // Path LDPlayer
  ipcMainHandle("setLDPlayerPath", setLDPlayerPath);
  ipcMainHandle("getLDPlayerPath", getLDPlayerPath);

  // LDPlayer
  ipcMainHandle("getDataCreateLDPlayers", getTableCreateLdInstance);
  ipcMainHandle("createLdInstance", createLdInstance);
  ipcMainHandle("moveSelectedLDPlayers", moveLdInstace);
  ipcMainHandle("getLDPlayersDB", getLdInstance);
  ipcMainHandle("callLdInstance", callLdInstance);
  ipcMainHandle("deleteLdInstance", deleteLdInstance);
  ipcMainHandle("deleteRowFromDB", deleteRowFromDB);
  ipcMainHandle("fetchLdInstance", fetchLdInstance);
  ipcMainHandle("getTokenLdInstance", getTokenLdInstance);

  // Line Kai
  ipcMainHandle("addAccountLineId", addLineKai);
  ipcMainHandle("getAccountLineId", getTableDataLineKai);
  ipcMainHandle("deleteAccountLineId", deleteLineKai);

  // Function Line Api
  ipcMainHandle("addFriends", addFriends);
  ipcMainHandle("mainCreateGroup", mainCreateGroup);
  ipcMainHandle("checkBanLdInstance", checkBanLdInstance);

  //Txt File
  ipcMainHandle("getTxtFiles", getTxtFiles);
  ipcMainHandle("saveTxtFile", saveTxtFile);
  ipcMainHandle("deleteTxtFile", deleteTxtFile);
  ipcMainHandle("updatePhoneFile", updatePhoneFile);
  ipcMainHandle("selectTextFile", selectTextFile);

  //ImageProfile
  ipcMainHandle("getImageProfile", getImageProfile);
}
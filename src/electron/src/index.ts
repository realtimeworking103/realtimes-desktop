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
import { mainCreateGroup } from "./line-api/createChatAsync.js";

import {
  deleteTxtFile,
  getTxtFiles,
  saveTxtFile,
  selectTextFile,
} from "./services/fileService.js";

import { updatePhoneFile } from "./function-db.js";
import { login, logout } from "./api/index.js";
import { getWindowsSID } from "./utils/getWindowsSid.js";
import { setAuthData, clearAuthData } from "./config/app-config.js";
import { selectImageFile } from "./services/profileService.js";

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

  //Login
  ipcMainHandle("login", async (payload) => {
    const { username, password } = payload;
    const hwid = await getWindowsSID();
    const response = await login(username, password, hwid);
    
    // Store auth data for logout
    setAuthData(response.result.sessionId, response.result.userId);
    
    return { sessionId: response.result.sessionId, userId: response.result.userId };
  });

  //Logout
  ipcMainHandle("logout", async (payload: { sessionId: string; userId: string } ) => {
    const { sessionId, userId } = payload;
    const response = await logout(sessionId, userId);
    
    // Clear auth data after logout
    clearAuthData();
    
    return response.result;
  });

  //Select Image File
  ipcMainHandle("selectImageFile", selectImageFile);
}
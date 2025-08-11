import { BrowserWindow } from "electron";
import { ipcMainHandle } from "../utils/ipc-utils.js";
import { getStatisData, pollResources } from "./resource-manager.js";

import {
  getLdInstancePath,
  browseLdInstancePath,
} from "./services/ldplayer/getLdInstancePath.js";

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
import { createChatSystem } from "./line-api/createChatSystem.js";
import { createChatCustom } from "./line-api/createChatCustom.js";
import { createChat } from "./client/createChat.js";

import {
  deleteTxtFile,
  getTxtFiles,
  saveTxtFile,
  selectTextFile,
  updateFileCount,
} from "./services/fileService.js";

import { updatePhoneFile } from "./function-db.js";
import { login, logout } from "./api/index.js";

import {
  deleteProfile,
  getProfile,
  selectImageFile,
} from "./services/profileService.js";

import {
  getAccount,
  addAccount,
  deleteAccount,
  updateAccount,
  saveRememberedCredentials,
  getRememberedCredentials,
  deleteRememberedCredentials,
} from "./services/accountService.js";

import {
  selectFileNameGroup,
  getFileNameGroup,
  deleteNameGroup,
  addNameGroup,
  editNameGroup,
} from "./services/nameService.js";

import { inviteIntoChats } from "./client/inviteIntoChat.js";
import {
  addMessage,
  deleteMessage,
  getMessage,
  editMessage,
} from "./services/messageService.js";
import {
  addStatus,
  deleteStatus,
  getStatus,
  updateStatus,
  updateStatusLDPlayer,
} from "./services/statusService.js";
import { addMe } from "./line-api/addMe.js";
import {
  getVersionData,
  updateCurrentVersion,
  addAvailableVersion,
  removeAvailableVersion,
} from "./services/versionService.js";

export default function initMain(mainWindow: BrowserWindow) {
  pollResources(mainWindow);
  ipcMainHandle("getStaticData", getStatisData);

  // Path LDPlayer
  ipcMainHandle("getLdInstancePath", () => getLdInstancePath());
  ipcMainHandle("browseLdInstancePath", () => browseLdInstancePath());

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
  ipcMainHandle("createChatSystem", createChatSystem);
  ipcMainHandle("createChatCustom", createChatCustom);
  ipcMainHandle("checkBanLdInstance", checkBanLdInstance);

  //Txt File
  ipcMainHandle("getTxtFiles", getTxtFiles);
  ipcMainHandle("saveTxtFile", saveTxtFile);
  ipcMainHandle("deleteTxtFile", deleteTxtFile);
  ipcMainHandle("updatePhoneFile", updatePhoneFile);
  ipcMainHandle("selectTextFile", selectTextFile);
  ipcMainHandle("updateFileCount", updateFileCount);

  //Login
  ipcMainHandle("login", login);
  ipcMainHandle("logout", logout);

  //Account
  ipcMainHandle("getAccount", getAccount);
  ipcMainHandle("addAccount", addAccount);
  ipcMainHandle("deleteAccount", deleteAccount);
  ipcMainHandle("updateAccount", updateAccount);

  //Remembered Credentials
  ipcMainHandle("saveRememberedCredentials", saveRememberedCredentials);
  ipcMainHandle("getRememberedCredentials", getRememberedCredentials);
  ipcMainHandle("deleteRememberedCredentials", deleteRememberedCredentials);

  //Profile
  ipcMainHandle("selectImageFile", selectImageFile);
  ipcMainHandle("getProfile", getProfile);
  ipcMainHandle("deleteProfile", deleteProfile);

  //Name Group
  ipcMainHandle("selectFileNameGroup", selectFileNameGroup);
  ipcMainHandle("getFileNameGroup", getFileNameGroup);
  ipcMainHandle("deleteNameGroup", deleteNameGroup);
  ipcMainHandle("addNameGroup", addNameGroup);
  ipcMainHandle("editNameGroup", editNameGroup);

  //Invite Into Chat
  ipcMainHandle("inviteIntoChats", inviteIntoChats);

  //Message
  ipcMainHandle("addMessage", addMessage);
  ipcMainHandle("deleteMessage", deleteMessage);
  ipcMainHandle("getMessage", getMessage);
  ipcMainHandle("editMessage", editMessage);

  //Create Chat
  ipcMainHandle("createChat", createChat);

  //Status
  ipcMainHandle("getStatus", getStatus);
  ipcMainHandle("addStatus", addStatus);
  ipcMainHandle("updateStatus", updateStatus);
  ipcMainHandle("deleteStatus", deleteStatus);
  ipcMainHandle("updateStatusLDPlayer", updateStatusLDPlayer);

  //Add Me
  ipcMainHandle("addMe", addMe);

  //Version Management
  ipcMainHandle("getVersionData", getVersionData);
  ipcMainHandle("updateCurrentVersion", updateCurrentVersion);
  ipcMainHandle("addAvailableVersion", addAvailableVersion);
  ipcMainHandle("removeAvailableVersion", removeAvailableVersion);
}

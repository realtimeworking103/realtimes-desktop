import { BrowserWindow } from "electron";
import { ipcMainHandle } from "../utils/ipc-utils.js";
import { getStatisData, pollResources } from "./resource-manager.js";

// ===== Account Service =====
import {
  addAccount,
  deleteAccount,
  getAccount,
  updateAccount,
  saveRememberedCredentials,
  getRememberedCredentials,
  deleteRememberedCredentials,
} from "./services/accountService.js";

// ===== API =====
import { login, logout } from "./api/index.js";

// ===== File Service =====
import {
  deleteTxtFile,
  getTxtFiles,
  saveTxtFile,
  selectTextFile,
  updateFileCount,
} from "./services/fileService.js";

// ===== Function DB =====
import { updatePhoneFile } from "./function-db.js";

// ===== LDPlayer Services =====
import {
  browseLdInstancePath,
  getLdInstancePath,
} from "./services/ldplayer/getLdInstancePath.js";
import { callLdInstance } from "./services/ldplayer/callLdInstance.js";
import { createLdInstance } from "./services/ldplayer/createLdInstace.js";
import { deleteLdInstance } from "./services/ldplayer/deleteLdInstance.js";
import { deleteRowFromDB } from "./services/ldplayer/delteRowLdInstace.js";
import { fetchLdInstance } from "./services/ldplayer/fetchLdInstance.js";
import { getLdInstance } from "./services/ldplayer/getLdInstance.js";
import { getTableCreateLdInstance } from "./services/ldplayer/getTableCreateLdInstance.js";
import { getTokenLdInstance } from "./services/ldplayer/getTokenLdInstance.js";
import { moveLdInstace } from "./services/ldplayer/moveLdInstace.js";

// ===== LINE API =====
import { addFriends } from "./line-api/function-addfriends.js";
import { checkBanLdInstance } from "./line-api/function-checkban.js";
import { createChatSystem } from "./line-api/createChatSystem.js";
import { createChatCustom } from "./line-api/createChatCustom.js";

// ===== Client =====
import { createChat } from "./client/createChat.js";
import { inviteIntoChats } from "./client/inviteIntoChat.js";

// ===== LINE API - Add Me =====
import { findAndAddFriend } from "./line-api/addMe.js";

// ===== Message Service =====
import {
  addMessage,
  deleteMessage,
  editMessage,
  getMessage,
} from "./services/messageService.js";

// ===== Name Service =====
import {
  addNameGroup,
  deleteNameGroup,
  editNameGroup,
  getFileNameGroup,
  selectFileNameGroup,
} from "./services/nameService.js";

// ===== Profile Service =====
import {
  deleteProfile,
  getProfile,
  selectImageFile,
} from "./services/profileService.js";

// ===== Status Service =====
import {
  addStatus,
  deleteStatus,
  getStatus,
  updateStatus,
  updateStatusLDPlayer,
} from "./services/statusService.js";

// ===== Version Service =====
import {
  addAvailableVersion,
  getVersionData,
  removeAvailableVersion,
  updateCurrentVersion,
} from "./services/versionService.js";

export default function initMain(mainWindow: BrowserWindow) {
  pollResources(mainWindow);
  ipcMainHandle("getStaticData", getStatisData);

  // ===== Auth =====
  ipcMainHandle("login", login);
  ipcMainHandle("logout", logout);

  // ===== LDPlayer Path =====
  ipcMainHandle("browseLdInstancePath", () => browseLdInstancePath());
  ipcMainHandle("getLdInstancePath", () => getLdInstancePath());

  // ===== LDPlayer Management =====
  ipcMainHandle("callLdInstance", callLdInstance);
  ipcMainHandle("checkBanLdInstance", checkBanLdInstance);
  ipcMainHandle("createLdInstance", createLdInstance);
  ipcMainHandle("deleteLdInstance", deleteLdInstance);
  ipcMainHandle("deleteRowFromDB", deleteRowFromDB);
  ipcMainHandle("fetchLdInstance", fetchLdInstance);
  ipcMainHandle("getDataCreateLDPlayers", getTableCreateLdInstance);
  ipcMainHandle("getLDPlayersDB", getLdInstance);
  ipcMainHandle("getTokenLdInstance", getTokenLdInstance);
  ipcMainHandle("moveSelectedLDPlayers", moveLdInstace);

  // ===== LINE API =====
  ipcMainHandle("addFriends", addFriends);
  ipcMainHandle("createChat", createChat);
  ipcMainHandle("createChatCustom", createChatCustom);
  ipcMainHandle("createChatSystem", createChatSystem);
  ipcMainHandle("findAndAddFriend", findAndAddFriend);
  ipcMainHandle("inviteIntoChats", inviteIntoChats);

  // ===== File Management =====
  ipcMainHandle("deleteTxtFile", deleteTxtFile);
  ipcMainHandle("getTxtFiles", getTxtFiles);
  ipcMainHandle("saveTxtFile", saveTxtFile);
  ipcMainHandle("selectTextFile", selectTextFile);
  ipcMainHandle("updateFileCount", updateFileCount);
  ipcMainHandle("updatePhoneFile", updatePhoneFile);

  // ===== Account Management =====
  ipcMainHandle("addAccount", addAccount);
  ipcMainHandle("deleteAccount", deleteAccount);
  ipcMainHandle("getAccount", getAccount);
  ipcMainHandle("updateAccount", updateAccount);

  // ===== Profile Management =====
  ipcMainHandle("deleteProfile", deleteProfile);
  ipcMainHandle("getProfile", getProfile);
  ipcMainHandle("selectImageFile", selectImageFile);

  // ===== Name Group Management =====
  ipcMainHandle("addNameGroup", addNameGroup);
  ipcMainHandle("deleteNameGroup", deleteNameGroup);
  ipcMainHandle("editNameGroup", editNameGroup);
  ipcMainHandle("getFileNameGroup", getFileNameGroup);
  ipcMainHandle("selectFileNameGroup", selectFileNameGroup);

  // ===== Message Management =====
  ipcMainHandle("addMessage", addMessage);
  ipcMainHandle("deleteMessage", deleteMessage);
  ipcMainHandle("editMessage", editMessage);
  ipcMainHandle("getMessage", getMessage);

  // ===== Status Management =====
  ipcMainHandle("addStatus", addStatus);
  ipcMainHandle("deleteStatus", deleteStatus);
  ipcMainHandle("getStatus", getStatus);
  ipcMainHandle("updateStatus", updateStatus);
  ipcMainHandle("updateStatusLDPlayer", updateStatusLDPlayer);

  // ===== Remembered Credentials =====
  ipcMainHandle("deleteRememberedCredentials", deleteRememberedCredentials);
  ipcMainHandle("getRememberedCredentials", getRememberedCredentials);
  ipcMainHandle("saveRememberedCredentials", saveRememberedCredentials);

  // ===== Version Management =====
  ipcMainHandle("addAvailableVersion", addAvailableVersion);
  ipcMainHandle("getVersionData", getVersionData);
  ipcMainHandle("removeAvailableVersion", removeAvailableVersion);
  ipcMainHandle("updateCurrentVersion", updateCurrentVersion);
}

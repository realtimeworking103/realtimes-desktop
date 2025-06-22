import { BrowserWindow } from "electron";
import { ipcMainHandle } from "../utils/ipc-utils.js";
import { getStatisData, pollResources } from "./resource-manager.js";

import {
  callLdInstance,
  deleteLdInstance,
  fetchLdInstance,
  createLDPlayers,
} from "./function-ldplayer.js";

import { getLDPlayersDB, getCreateLDPlayersDB, getAccountLineId } from "./db-getLdplayer.js";
import { setLDPlayerPath, getLDPlayerPath } from "./db-pathLd.js";
import {
  deleteRowFromDB,
  moveSelectedLDPlayers,
  updatePhoneFile,
} from "./function-db.js";
import {
  pullDBLdInstanceAuto,
  pullDBLdInstanceManual,
} from "./function-pulldatabase.js";
import { getContact } from "./line-api/function-getcontact.js";
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
  ipcMainHandle("getLDPlayersDB", getLDPlayersDB);
  ipcMainHandle("callLdInstance", callLdInstance);
  ipcMainHandle("deleteLdInstance", deleteLdInstance);
  ipcMainHandle("deleteRowFromDB", deleteRowFromDB);
  ipcMainHandle("fetchLdInstance", fetchLdInstance);
  ipcMainHandle("pullDBLdInstanceAuto", pullDBLdInstanceAuto);
  ipcMainHandle("pullDBLdInstanceManual", pullDBLdInstanceManual);
  ipcMainHandle("getDataCreateLDPlayers", getCreateLDPlayersDB);
  ipcMainHandle("createLDPlayers", createLDPlayers);
  ipcMainHandle("moveSelectedLDPlayers", moveSelectedLDPlayers);
  ipcMainHandle("setLDPlayerPath", setLDPlayerPath);
  ipcMainHandle("getLDPlayerPath", getLDPlayerPath);
  ipcMainHandle("getTxtFiles", getTxtFiles);
  ipcMainHandle("saveTxtFile", saveTxtFile);
  ipcMainHandle("deleteTxtFile", deleteTxtFile);
  ipcMainHandle("updatePhoneFile", updatePhoneFile);
  ipcMainHandle("getAccountLineId", getAccountLineId);
  ipcMainHandle("addFriends", addFriends);

  ipcMainHandle("createGroup", async ({ ldName, accessToken }) => {
    const nameGroup = ``;
    try {

      await mainCreateGroup({ accessToken, nameGroup, ldName });
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("CreateGroup error:", msg);
      return { success: false, message: msg };
    }
  });

  ipcMainHandle("checkBanLdInstance", async ({ ldName, accessToken }) => {
    try {
      checkBanLdInstance({ accessToken, ldName });
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Checkban error:", msg);
      return { success: false, message: msg };
    }
  });
}

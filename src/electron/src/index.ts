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
import {
  pullDBLdInstanceAuto,
  pullDBLdInstanceManual,
} from "./function-pulldatabase.js";
import { createGroup } from "./line-api/function-creategroup.js";
import { getContact } from "./line-api/function-getcontact.js";
import { checkBanLdInstance } from "./line-api/function-checkban.js";

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

  ipcMainHandle("createGroup", async ({ ldName, accessToken }) => {
    const nameGroup = ``;
    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    try {
      await getContact(accessToken);
      await sleep(1000);
      await createGroup({ accessToken, nameGroup, ldName });
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

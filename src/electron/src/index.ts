import { BrowserWindow } from "electron";
import { ipcMainHandle } from "../utils/ipc-utils.js";
import { getStatisData, pollResources } from "./resource-manager.js";
import { getLDPlayersDB, deleteRowFromLDPlayers } from "./function-db.js";
import { callLdInstance, deleteLdInstance, pullDataBase} from "./function-ldplayer.js";

export default function initMain(mainWindow: BrowserWindow) {
  pollResources(mainWindow);
  ipcMainHandle("getStaticData", getStatisData);
  ipcMainHandle("getLDPlayersDB", getLDPlayersDB);
  ipcMainHandle("callLdInstance", callLdInstance);
  ipcMainHandle("deleteLdInstance", deleteLdInstance);
  ipcMainHandle("deleteRowFromLDPlayers", deleteRowFromLDPlayers);
  ipcMainHandle("pullDataBase", pullDataBase);
}

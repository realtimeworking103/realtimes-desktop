import { BrowserWindow } from "electron";
import { ipcMainHandle } from "../utils/ipc-utils.js";
import { getStatisData, pollResources } from "./resource-manager.js";
import { exec } from "child_process";
import Database from "better-sqlite3";

export default function initMain(mainWindow: BrowserWindow) {
  pollResources(mainWindow);
  ipcMainHandle("getStaticData", getStatisData);
  ipcMainHandle("callLdInstance", (payload) => callLdInstance(payload));

  ipcMainHandle("functionA", (payload) => {
    console.log(payload);

    return `Hello, ${payload.name}`;
  });

  ipcMainHandle("createLdInstance", (payload) => {
    const response = exec(
      `"F:\\LDTEST\\LDPlayer\\LDPlayer9\\ldconsole.exe" launch --name ${payload.name}`,
      (error, stdout, stderr) => {
        if (error) {
          // console.error("error", error);
        }
        // console.log("stdout", stdout);
        // console.log("stderr", stderr);
      },
    );

    return 0;
  });

  ipcMainHandle("getLDPlayersDB", () => {
    const db = new Database("database.db");
    const rows = db.prepare("SELECT id, name FROM ldplayers").all();
    return rows as { id: string; name: string }[];
  });
}

function callLdInstance(name: string) {
  const ldconsolePath = `"F:\\LDTEST\\LDPlayer\\LDPlayer9\\ldconsole.exe"`;
  const cmd = `${ldconsolePath} launch --name "${name}"`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error("Failed to launch LDPlayer:", error);
      return;
    }
    console.log("LDPlayer launched:", stdout);
  });

  return 0;
}
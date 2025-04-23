import { BrowserWindow } from "electron";
import { ipcMainHandle } from "../utils/ipc-utils.js";
import { getStatisData, pollResources } from "./resource-manager.js";
import { exec } from "child_process";

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
      `"D:\\LDPlayer\\LDPlayer9\\ldconsole.exe" launch --name ${payload.name}`,
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
}

function callLdInstance(payload: number) {
  console.log(payload);

  return payload;
}

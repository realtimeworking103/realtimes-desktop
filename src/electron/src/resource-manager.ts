import osUtils from "os-utils";
import fs from "fs";
import os from "os";
import { BrowserWindow } from "electron";
import { ipcWebContentsSend } from "../utils/icp-utils.js";

const POLLING_INTERVAL = 500;

export function pollResources(mainWindow: BrowserWindow) {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const ramUsage = getMemoryUsage();
    const storageUsage = getStorageUsage();

    ipcWebContentsSend("statistics", mainWindow.webContents, {
      cpuUsage,
      ramUsage,
      storageUsage: storageUsage.usage,
    });
  }, POLLING_INTERVAL);
}

export function getStatisData() {
  const totalStorage = getStorageUsage().total;
  const cpuModel = os.cpus()[0].model;
  const totalMemoryGB = Math.floor(os.totalmem() / 1024);

  return {
    totalStorage,
    cpuModel,
    totalMemoryGB,
  };
}

function getCpuUsage(): Promise<number> {
  return new Promise((resolve) => {
    osUtils.cpuUsage(resolve);
  });
}

function getMemoryUsage() {
  return 1 - osUtils.freememPercentage();
}

function getStorageUsage() {
  const stats = fs.statfsSync(process.platform === "win32" ? "C://" : "/");
  const total = stats.blocks * stats.bsize;
  const free = stats.bfree * stats.bsize;
  return {
    total: Math.floor(total / 1_000_000_000),
    usage: 1 - free / total,
  };
}

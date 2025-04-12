import { app, BrowserWindow } from "electron";
import { isDev } from "./utils/is-dev.js";
import { getPreloadPath, getUIPath } from "./utils/path-resolver.js";
import { getStatisData, pollResources } from "./src/resource-manager.js";
import { ipcMainHandle } from "./utils/ipc-utils.js";

const createWindow = () => {
  const preloadPath = getPreloadPath();

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: preloadPath,
    },
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(getUIPath());
  }

  return mainWindow;
};

app.whenReady().then(() => {
  const mainWindow = createWindow();

  pollResources(mainWindow);

  ipcMainHandle("getStaticData", getStatisData);
  ipcMainHandle("callLdInstance", (payload) => callLdInstance(payload));
});

const callLdInstance = (id: number) => {
  console.log(id);

  return id;
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

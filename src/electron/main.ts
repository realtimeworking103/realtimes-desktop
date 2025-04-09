import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./utils/is-dev.js";
import { getPreloadPath } from "./utils/path-resolver.js";
import { getStatisData, pollResources } from "./src/resource-manager.js";
import { ipcMainHandle } from "./utils/icp-utils.js";
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
    mainWindow.loadFile(path.join(app.getAppPath(), "dist-react/index.html"));
  }

  return mainWindow;
};

app.whenReady().then(() => {
  const mainWindow = createWindow();

  pollResources(mainWindow);

  ipcMainHandle("getStaticData", getStatisData);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

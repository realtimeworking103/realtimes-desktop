import { app, BrowserWindow } from "electron";
import { isDev } from "./utils/is-dev.js";
import { getPreloadPath, getUIPath } from "./utils/path-resolver.js";
import initMain from "./src/index.js";

const createWindow = () => {
  const preloadPath = getPreloadPath();

  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
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

  initMain(mainWindow);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
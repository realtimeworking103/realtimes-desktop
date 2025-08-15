import { app, BrowserWindow } from "electron";
import { isDev } from "./utils/is-dev.js";
import { getPreloadPath, getUIPath } from "./utils/path-resolver.js";
import initMain from "./src/index.js";
import { logout } from "./src/api/index.js";
import { getAuthData } from "./src/config/app-config.js";

const createWindow = () => {
  const preloadPath = getPreloadPath();

  const mainWindow = new BrowserWindow({
    show: false,
    minWidth: 1600,
    minHeight: 900,
    x: 100,
    y: 100,
    webPreferences: {
      preload: preloadPath,
      webSecurity: false,
    },
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(getUIPath());
  }

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.executeJavaScript(`
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    `);
  });

  mainWindow.maximize();
  mainWindow.show();

  return mainWindow;
};

app.whenReady().then(() => {
  const mainWindow = createWindow();

  const originalLog = console.log;
  console.log = function (...args) {
    originalLog.apply(console, args);
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send("test", args.join(" "));
    }
  };

  mainWindow.on("close", async (event) => {
    // Prevent window from closing immediately
    event.preventDefault();

    // Get stored auth data for logout
    const authData = getAuthData();
    if (authData) {
      await logout({ sessionId: authData.sessionId, userId: authData.userId });
    }

    // Show confirmation or cleanup
    console.log("Window is about to close");

    // Do async or sync cleanup, then:
    // Remove the listener to avoid infinite loop
    mainWindow.removeAllListeners("close");
    mainWindow.close();
  });

  initMain(mainWindow);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

import { app } from "electron";
import path from "path";
import { isDev } from "./is-dev.js";

export function getPreloadPath() {
  return path.join(
    app.getAppPath(),
    isDev() ? "." : "..",
    "/dist-electron/preload.cjs"
  );
}

export function getUIPath() {
  return path.join(app.getAppPath(), "/dist-react/index.html");
}

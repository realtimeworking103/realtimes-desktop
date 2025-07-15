import { execAsync } from "../execCommand.js";
import db from "../sqliteService.js";
import { getLdConsolePath } from "./getLdConsolePath.js";

export async function callLdInstance(ldName: string): Promise<boolean> {
  const ldconsolePath = getLdConsolePath();

  const cmd = `"${ldconsolePath}" launch --name "${ldName}"`;

  try {
    await execAsync(cmd);
    console.log("LDPlayer launched:", ldName);
    return true;
  } catch (error) {
    db.prepare(
      "UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?",
    ).run("ไม่พบ LDPlayer", ldName);
    console.error("Failed to launch LDPlayer:", error);
  }

  return false;
}
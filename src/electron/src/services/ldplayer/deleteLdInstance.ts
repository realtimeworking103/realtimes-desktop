import { execAsync } from "../execCommand.js";
import db from "../sqliteService.js";
import { getLdConsolePath } from "./getLdConsolePath.js";

export async function deleteLdInstance(ldName: string): Promise<boolean> {
  const ldconsolePath = getLdConsolePath();

  const cmd = `"${ldconsolePath}" remove --name "${ldName}"`;

  try {
    await execAsync(cmd);
    db.prepare(
      "UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?",
    ).run("ลบ LDPlayer แล้ว", ldName);
    return true;
  } catch (error) {
    console.error("Failed to delete LDPlayer:", error);
    db.prepare(
      "UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?",
    ).run("ลบ LDPlayer แล้ว", ldName);
    return false;
  }
}

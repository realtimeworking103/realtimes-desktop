import { execAsync } from "../execCommand.js";
import db from "../sqliteService.js";
import { getLdInstancePath } from "./getLdInstancePath.js";

export async function deleteLdInstance(ldName: string): Promise<boolean> {
  const ldconsolePath = getLdInstancePath();

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

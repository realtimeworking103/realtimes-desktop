import { dialog } from "electron";
import db from "../sqliteService.js";

export async function browseLdInstancePath(): Promise<boolean> {
  try {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [
        {
          name: "ldconsole",
          extensions: ["exe"],
        },
      ],
    });
    if (result.filePaths.length > 0) {
      const path = result.filePaths[0];
      setLdInstancePath(path);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error browsing LDPlayer instance path:", error);
    return false;
  }
}

export function getLdInstancePath(): string {
  try {
    db.prepare(
      `
    CREATE TABLE IF NOT EXISTS Setting (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `,
    ).run();
  } catch (error) {
    console.error("Error creating Setting table:", error);
  }

  try {
    const row = db
      .prepare("SELECT value FROM Setting WHERE key = ?")
      .get("ldinstance_path") as { value: string } | undefined;
    return row?.value ?? "";
  } catch (error) {
    console.error("Error getting LDPlayer instance path:", error);
    return "";
  }
}

export function setLdInstancePath(path: string) {
  try {
    db.prepare("INSERT OR REPLACE INTO Setting (key, value) VALUES (?, ?)").run(
      "ldinstance_path",
      path,
    );
  } catch (error) {
    console.error("Error setting LDPlayer instance path:", error);
  }
}

import db from "../sqliteService.js";

export function setLDPlayerPath(path: string): boolean {
  try {
    db.prepare(
      `
      INSERT INTO Setting (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `,
    ).run("ldplayer_path", path);

    return true;
  } catch (error) {
    console.error("Error setting LDPlayer path:", error);
    return false;
  }
}
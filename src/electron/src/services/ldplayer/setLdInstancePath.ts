import db from "../sqliteService.js";

export function setLDPlayerPath(path: string) {
  db.prepare(
    `
    INSERT INTO Setting (key, value)
    VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `,
  ).run("ldplayer_path", path);

  return false;
}
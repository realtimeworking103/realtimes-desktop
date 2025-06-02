import db from "./config-db.js";

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

export function getLDPlayerPath(): string {
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS Setting (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `,
  ).run();
  const row = db
    .prepare("SELECT value FROM Setting WHERE key = ?")
    .get("ldplayer_path") as { value: string } | undefined;
  return row?.value ?? "";
}

export function getLDConsolePath(): string {
  const row = db
    .prepare("SELECT value FROM Setting WHERE key = ?")
    .get("ldplayer_path") as { value: string } | undefined;
  return row?.value ?? "";
}

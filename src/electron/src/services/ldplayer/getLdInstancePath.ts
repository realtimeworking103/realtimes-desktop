import db from "../sqliteService.js";

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

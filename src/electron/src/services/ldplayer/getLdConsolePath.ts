import db from "../sqliteService.js";

export function getLdConsolePath(): string {
  const row = db
    .prepare("SELECT value FROM Setting WHERE key = ?")
    .get("ldplayer_path") as { value: string } | undefined;

  if (!row?.value) {
    throw new Error("LDPlayer path not found in database");
  }

  return row.value;
}
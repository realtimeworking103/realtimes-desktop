import db from "../sqliteService.js";

export function deleteRowFromDB(ldName: string) {
  try {
    db.prepare("DELETE FROM GridLD WHERE LDPlayerGridLD = ?").run(ldName);
    return true;
  } catch (err) {
    return false;
  }
}
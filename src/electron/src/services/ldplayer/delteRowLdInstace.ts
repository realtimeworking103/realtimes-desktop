import db from "../sqliteService.js";

export function deleteRowFromDB(ldName: string): boolean {
  try {
    const result = db.prepare("DELETE FROM GridLD WHERE LDPlayerGridLD = ?").run(ldName);
    return result.changes > 0;
  } catch (err) {
    console.error("Error deleting row from DB:", err);
    return false;
  }
}
import db from "./sqliteService.js";

export function getTxtFiles() {
  db.prepare(
    `
      CREATE TABLE IF NOT EXISTS Files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        count INTEGER,
        path TEXT,
        createAt TIMESTAMP DEFAULT (datetime('now', 'localtime'))
      )
    `,
  ).run();

  const rows = db.prepare("SELECT id, name, count, createAt FROM Files").all();
  return rows as {
    id: number;
    name: string;
    count: number;
    path: string;
    createAt: string;
  }[];
}

export function saveTxtFile({
  name,
  count,
  path,
}: {
  name: string;
  count: number;
  path: string;
}): boolean {
  
  try {
    db.prepare(
      `
      INSERT INTO Files (name, count, path)
      VALUES (?, ?, ?)
      `,
    ).run(name, count, path);

    return true;
  } catch (err) {
    console.error("❌ Error saving file:", err);
    return false;
  }
}

export function deleteTxtFile(name: string) {
  try {
    const stmt = db.prepare("DELETE FROM Files WHERE name = ?");
    const result = stmt.run(name);

    return result.changes > 0;
  } catch (err) {
    console.error("❌ Error deleting file from DB:", err);
    return false;
  }
}

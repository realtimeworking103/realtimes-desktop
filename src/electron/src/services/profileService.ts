import db from "./sqliteService.js";

export function getImageProfile() {
  db.prepare(
    `
      CREATE TABLE IF NOT EXISTS ImageProfile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image TEXT,
        path TEXT,
        createAt TIMESTAMP DEFAULT (datetime('now', 'localtime'))
      )
    `,
  ).run();

  const rows = db.prepare("SELECT id, image, path, createAt FROM ImageProfile").all();
  return rows as {
    id: number;
    createAt: string;
    image: string;
    path: string;
  }[];
}

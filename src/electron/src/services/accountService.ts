import db from "./sqliteService.js";

export function getAccount() {
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS Account (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT,
      name TEXT,
      mid TEXT,
      status BOOLEAN,
      createAt TIMESTAMP DEFAULT (datetime('now', 'localtime'))
    )
    `,
  ).run();

  const rows = db
    .prepare("SELECT id, type, name, mid, status,  createAt FROM Account")
    .all();
  return rows as {
    id: number;
    type: string;
    name: string;
    mid: string;
    status: boolean;
    createAt: string;
  }[];
}

export function addAccount(payload: {
  type: string;
  name: string;
  mid: string;
  status: boolean;
}) {
  db.prepare(
    "INSERT INTO Account (type, name, mid, status) VALUES (?, ?, ?, ?)",
  ).run(
    payload.type,
    payload.name,
    payload.mid,
    payload.status ? 1 : 0,
  );
  return true;
}

export function deleteAccount(payload: string) {
  db.prepare("DELETE FROM Account WHERE name = ?").run(payload);
  return true;
}

export function updateAccount(payload: {
  name: string;
  type: string;
  mid: string;
  status: boolean;
}) {
  db.prepare(
    "UPDATE Account SET  name = ?, mid = ?, type = ?, status = ? WHERE name = ?",
  ).run(
    payload.name,
    payload.mid,
    payload.type,
    payload.status ? 1 : 0,
    payload.name,
  );
  return true;
}

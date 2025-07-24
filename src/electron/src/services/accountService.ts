import db from "./sqliteService.js";
export function getAccount() {
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS Account (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        name TEXT,
        status BOOLEAN,
        createAt TIMESTAMP DEFAULT (datetime('now', 'localtime'))
    )
    `,
  ).run();

  const rows = db
    .prepare("SELECT id, type, name, status, createAt FROM Account")
    .all();
  return rows as {
    id: number;
    type: string;
    name: string;
    status: boolean;
    createAt: string;
  }[];
}

export function addAccount(payload: {
  type: string;
  name: string;
  status: boolean;
}) {
  db.prepare("INSERT INTO Account (type, name, status) VALUES (?, ?, ?)").run(
    payload.type,
    payload.name,
    payload.status ? 1 : 0,
  );
  return true;
}

export function deleteAccount(payload: number) {
  db.prepare("DELETE FROM Account WHERE id = ?").run(payload);
  return true;
}

export function updateAccount(payload: {
  name: string;
  type: string;
  status: boolean;
}) {
  db.prepare(
    "UPDATE Account SET type = ?, name = ?, status = ? WHERE name = ?",
  ).run(payload.type, payload.name, payload.status ? 1 : 0, payload.name);
  return true;
}

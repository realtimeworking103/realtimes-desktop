import db from "./sqliteService.js";

export async function getMessage() {
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS message (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nameMessage TEXT,
      message TEXT,
      createAt TIMESTAMP DEFAULT (datetime('now', 'localtime'))
    )
    `,
  ).run();

  const rows = db.prepare("SELECT * FROM message").all();
  return rows as {
    id: number;
    nameMessage: string;
    message: string;
  }[];
}

export async function addMessage(payload: {
  nameMessage: string;
  message: string;
}) {
  db.prepare("INSERT INTO message (nameMessage, message) VALUES (?, ?)").run(
    payload.nameMessage,
    payload.message,
  );
  return true;
}

export async function deleteMessage(id: number) {
  db.prepare("DELETE FROM message WHERE id = ?").run(id);
  return true;
}

export async function editMessage(payload: {
  id: number;
  nameMessage: string;
  message: string;
}) {
  db.prepare(
    "UPDATE message SET nameMessage = ?, message = ? WHERE id = ?",
  ).run(payload.nameMessage, payload.message, payload.id);
  return true;
}

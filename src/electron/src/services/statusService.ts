import db from "./sqliteService.js";

export function getStatus() {
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS status (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      status TEXT,
      createdAt TEXT
    )
    `,
  ).run();

  try {
    const rows = db.prepare("SELECT * FROM status").all();
    return rows as {
      id: number;
      status: string;
      createdAt: string;
    }[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export function addStatus(status: string) {
  try {
    db.prepare(
      "INSERT INTO status (status, createdAt) VALUES (?, datetime('now'))",
    ).run(status);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function updateStatus({ id, status }: { id: number; status: string }) {
  try {
    db.prepare("UPDATE status SET status = ? WHERE id = ?").run(status, id);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function deleteStatus(id: number) {
  try {
    db.prepare("DELETE FROM status WHERE id = ?").run(id);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function updateStatusLDPlayer({
  id,
  status,
}: {
  id: number;
  status: string;
}) {
  try {
    db.prepare(
      "UPDATE GridLD SET StatusAccGridLD = ?, DateTimeGridLD = datetime('now', 'localtime') WHERE NoDataGridLD = ?",
    ).run(status, id);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

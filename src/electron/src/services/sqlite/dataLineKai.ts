import db from "../sqliteService.js";

export function getTableDataLineKai(): {
  id: number;
  type: string;
  lineId: string;
}[] {
  db.prepare(
    `
      CREATE TABLE IF NOT EXISTS DataLineKai (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        lineId TEXT,
        create_at TEXT DEFAULT (datetime('now', 'localtime'))
      )
    `,
  ).run();

  const rows = db.prepare("SELECT id, type, lineId FROM DataLineKai").all();
  return rows as {
    id: number;
    type: string;
    lineId: string;
  }[];
}

export function addLineKai(payload: {
  lineId: string;
  type: string;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(
        "INSERT INTO DataLineKai (lineId, type) VALUES (?, ?)",
      );
      stmt.run(payload.lineId, payload.type);
      resolve("เพิ่มไอดีไลน์เรียบร้อยแล้ว");
    } catch (err) {
      reject(`เกิดข้อผิดพลาด: ${err}`);
    }
  });
}

export function deleteLineKai(id: number): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare("DELETE FROM DataLineKai WHERE id = ?");
      stmt.run(id);
      resolve("ลบไอดีไลน์เรียบร้อยแล้ว");
    } catch (err) {
      reject(`เกิดข้อผิดพลาด: ${err}`);
    }
  });
}

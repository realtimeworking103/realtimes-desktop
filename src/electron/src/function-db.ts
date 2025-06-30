import db from "./config-db.js";
import { DataCreateLDPlayerRow } from "../types/types.js";

export function deleteRowFromDB(ldName: string) {
  try {
    db.prepare("DELETE FROM GridLD WHERE LDPlayerGridLD = ?").run(ldName);
    return true;
  } catch (err) {
    return false;
  }
}

export function moveSelectedLDPlayers(ldNames: string[]): boolean {
  const selectFromCreate = db.prepare(`
    SELECT * FROM CreateLDPlayer WHERE LDPlayerGridLD = ?
  `);

  const checkIfExistsInGrid = db.prepare(`
    SELECT 1 FROM GridLD WHERE LDPlayerGridLD = ?
  `);

  const insertToGrid = db.prepare(`
    INSERT INTO GridLD (
      LDPlayerGridLD,
      StatusAccGridLD,
      StatusGridLD,
      CreateAt
    )
    VALUES (?, 'บัญชีรอการสมัคร', ?, '')
  `);

  const deleteFromCreate = db.prepare(`
    DELETE FROM CreateLDPlayer WHERE LDPlayerGridLD = ?
  `);

  let moved = 0;

  for (const name of ldNames) {
    const alreadyMoved = checkIfExistsInGrid.get(name);
    if (alreadyMoved) continue;

    const row = selectFromCreate.get(name) as DataCreateLDPlayerRow;
    if (!row) continue;

    insertToGrid.run(row.LDPlayerGridLD, row.StatusGridLD);
    deleteFromCreate.run(name);

    moved++;
  }

  return true;
}

export function addAccountLineId(payload: {
  lineId: string;
  type: string;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(
        "INSERT INTO LineAccounts (lineId, type) VALUES (?, ?)",
      );
      stmt.run(payload.lineId, payload.type);
      resolve("เพิ่มไอดีไลน์เรียบร้อยแล้ว");
    } catch (err) {
      reject(`เกิดข้อผิดพลาด: ${err}`);
    }
  });
}

export function getAccountLineId() {
  db.prepare(
    `
      CREATE TABLE IF NOT EXISTS LineAccounts (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        lineId TEXT
      )
    `,
  ).run();

  const rows = db.prepare("SELECT ID, type, lineId FROM LineAccounts").all();
  return rows as {
    ID: number;
    type: string;
    lineId: string;
  }[];
}

export function deleteAccountLineId(id: number): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare("DELETE FROM LineAccounts WHERE ID = ?");
      stmt.run(id);
      resolve("ลบไอดีไลน์เรียบร้อยแล้ว");
    } catch (err) {
      reject(`เกิดข้อผิดพลาด: ${err}`);
    }
  });
}

export function updatePhoneFile({
  ldName,
  fileName,
}: {
  ldName: string;
  fileName: string;
}): string {
  const result = db
    .prepare(
      `
    UPDATE GridLD SET StatusGridLD = ?, PhoneFileGridLD = ?, DateTimeGridLD = datetime('now', 'localtime') WHERE LDPlayerGridLD = ?
  `,
    )
    .run(`เปลี่ยนไฟล์ ${fileName}`, fileName, ldName);

  if (result.changes === 0) {
    return `ไม่พบ LDPlayer: ${ldName}`;
  }

  return `บันทึกไฟล์ ${fileName} ให้ ${ldName} สำเร็จ`;
}

import db from "./config-db.js";
import { DataCreateLDPlayerRow } from "../types/types.js";

export function deleteRowFromDB(ldName: string) {
  try {
    db.prepare("DELETE FROM GridLD WHERE LDPlayerGridLD = ?").run(ldName);
    return 1;
  } catch (err) {
    return 0;
  }
}

export function moveSelectedLDPlayers(ldNames: string[]): string {
  const selectFromCreate = db.prepare(`
    SELECT * FROM DataCreateLDPlayer WHERE LDPlayerGridLD = ?
  `);

  const checkIfExistsInGrid = db.prepare(`
    SELECT 1 FROM GridLD WHERE LDPlayerGridLD = ?
  `);

  const insertToGrid = db.prepare(`
    INSERT INTO GridLD (
      LDPlayerGridLD,
      StatusGridLD
    )
    VALUES (?, ?)
  `);

  const deleteFromCreate = db.prepare(`
    DELETE FROM DataCreateLDPlayer WHERE LDPlayerGridLD = ?
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

  return `Moved ${moved} new LDPlayer(s) to GridLD`;
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

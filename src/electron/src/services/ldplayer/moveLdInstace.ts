import db from "../sqliteService.js";
import { dataCreateLdInstancRow } from "../../../types/types.js";

export function moveLdInstace(ldNames: string[]): boolean {
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

    const row = selectFromCreate.get(name) as dataCreateLdInstancRow;
    if (!row) continue;

    insertToGrid.run(row.LDPlayerGridLD, row.StatusGridLD);
    deleteFromCreate.run(name);

    moved++;
  }

  return true;
}

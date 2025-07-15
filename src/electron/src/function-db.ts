import db from "./services/sqliteService.js";

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

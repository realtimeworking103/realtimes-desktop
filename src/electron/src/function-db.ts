import db from "./services/sqliteService.js";

export function updatePhoneFile({
  ldName,
  fileName,
}: {
  ldName: string;
  fileName: string;
}): string {
  try {
    // Input validation
    if (!ldName || ldName.trim() === "") {
      return "ชื่อ LDPlayer ไม่ถูกต้อง";
    }

    if (!fileName || fileName.trim() === "") {
      return "ชื่อไฟล์ไม่ถูกต้อง";
    }

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
  } catch (error) {
    console.error("Error updating phone file:", error);
    return `เกิดข้อผิดพลาดในการบันทึกไฟล์: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

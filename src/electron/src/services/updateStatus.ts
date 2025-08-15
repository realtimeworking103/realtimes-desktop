import db from "./sqliteService.js";

class UpdateStatus {
  static async updateStatusLogin(ldName: string, status: string) {
    db.prepare(
      `UPDATE GridLD SET StatusGridLD = ?, DateTimeGridLD = datetime('now', 'localtime') WHERE LDPlayerGridLD = ?`,
    ).run(status, ldName);
  }

  static async updateStatus(ldName: string, status: string, count: number) {
    db.prepare(
      `UPDATE GridLD SET StatusGridLD = ?, GroupGridLD = ?, DateTimeGridLD = datetime('now', 'localtime') WHERE LDPlayerGridLD = ?`,
    ).run(status, count.toString(), ldName);
  }

  static async updateStatusFindContactByUserid(ldName: string, status: string) {
    db.prepare(
      `UPDATE GridLD SET StatusGridLD = ?, DateTimeGridLD = datetime('now', 'localtime') WHERE LDPlayerGridLD = ?`,
    ).run(status, ldName);
  }

  static async updateStatusGetAllContactIds(ldName: string, status: string) {
    db.prepare(
      `UPDATE GridLD SET StatusGridLD = ?, DateTimeGridLD = datetime('now', 'localtime') WHERE LDPlayerGridLD = ?`,
    ).run(status, ldName);
  }

  static async updateStatusResponseChat(ldName: string, status: string) {
    db.prepare(
      `UPDATE GridLD SET StatusGridLD = ?, DateTimeGridLD = datetime('now', 'localtime') WHERE LDPlayerGridLD = ?`,
    ).run(status, ldName);
  }

  static async updateStatusCreateChat(
    ldName: string,
    status: string,
    groupCount: number,
  ) {
    db.prepare(
      `UPDATE GridLD SET StatusGridLD = ?, GroupGridLD = ?, DateTimeGridLD = datetime('now', 'localtime') WHERE LDPlayerGridLD = ?`,
    ).run(status, groupCount.toString(), ldName);
  }

  static async updateStatusSendMessage(ldName: string, status: string) {
    db.prepare(
      `UPDATE GridLD SET StatusGridLD = ?, DateTimeGridLD = datetime('now', 'localtime') WHERE LDPlayerGridLD = ?`,
    ).run(status, ldName);
  }
}

export default UpdateStatus;

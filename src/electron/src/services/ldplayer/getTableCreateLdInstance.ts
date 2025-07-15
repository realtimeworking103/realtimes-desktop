import db from "../sqliteService.js";

export function getTableCreateLdInstance() {
  db.prepare(
    `
      CREATE TABLE IF NOT EXISTS CreateLDPlayer (
        NoDataGridLD INTEGER PRIMARY KEY AUTOINCREMENT,
        LDPlayerGridLD TEXT,
        StatusGridLD TEXT,
        PrefixGridLD TEXT,
        DateTimeGridLD TIMESTAMP DEFAULT (datetime('now', 'localtime'))
      )
    `,
  ).run();

  const rows = db
    .prepare(
      "SELECT NoDataGridLD, LDPlayerGridLD, DateTimeGridLD, StatusGridLD, PrefixGridLD FROM CreateLDPlayer",
    )
    .all();
  return rows as {
    NoDataGridLD: number;
    LDPlayerGridLD: string;
    DateTimeGridLD: string;
    StatusGridLD: string;
    PrefixGridLD: string;
  }[];
}

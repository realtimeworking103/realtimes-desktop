import db from "./config-db.js";

export function getLDPlayersDB() {
  db.prepare(
    `
      CREATE TABLE IF NOT EXISTS GridLD (
        NoDataGridLD INTEGER PRIMARY KEY AUTOINCREMENT,
        LDPlayerGridLD TEXT,
        StatusAccGridLD TEXT,
        StatusGridLD TEXT,
        NameLineGridLD TEXT,
        FriendGridLD TEXT,
        GroupGridLD TEXT,
        PhoneGridLD TEXT,
        TokenGridLD TEXT,
        PhoneFileGridLD,
        DateTimeGridLD TIMESTAMP DEFAULT (datetime('now', 'localtime')),
        CreateAt TIMESTAMP DEFAULT (datetime('now', 'localtime'))
      )
    `,
  ).run();

  const rows = db
    .prepare(
      "SELECT NoDataGridLD, LDPlayerGridLD, StatusAccGridLD, StatusGridLD, NameLineGridLD, FriendGridLD, GroupGridLD, PhoneGridLD, TokenGridLD, PhoneFileGridLD, DateTimeGridLD, CreateAt FROM GridLD",
    )
    .all();
  return rows as {
    NoDataGridLD: number;
    LDPlayerGridLD: string;
    StatusAccGridLD: string;
    StatusGridLD: string;
    NameLineGridLD: string;
    FriendGridLD: string;
    GroupGridLD: string;
    PhoneGridLD: string;
    TokenGridLD: string;
    PhoneFileGridLD: string;
    DateTimeGridLD: string;
    CreateAt: string;
  }[];
}

export function getCreateLDPlayersDB() {
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

import Database from "better-sqlite3";
const db = new Database("database.db");

export function getLDPlayersDB() {
  db.prepare(
    `
      CREATE TABLE IF NOT EXISTS GridLD (
        NoDataGridLD INTEGER PRIMARY KEY AUTOINCREMENT,
        LDPlayerGridLD TEXT,
        StatusAccGridLD TEXT,
        StatusGridLD TEXT,
        NameGridLD TEXT,
        FriendGridLD TEXT,
        GroupGridLD TEXT,
        PhoneGridLD TEXT,
        TokenGridLD TEXT,
        DataTimeGridLD TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `,
  ).run();

  const rows = db
    .prepare(
      "SELECT NoDataGridLD, LDPlayerGridLD, StatusAccGridLD, StatusGridLD, NameGridLD, FriendGridLD, GroupGridLD, PhoneGridLD, TokenGridLD, DataTimeGridLD FROM GridLD",
    )
    .all();
  return rows as {
    NoDataGridLD: string;
    LDPlayerGridLD: string;
    StatusAccGridLD: string;
    StatusGridLD: string;
    NameGridLD: string;
    FriendGridLD: string;
    GroupGridLD: string;
    PhoneGridLD: string;
    TokenGridLD: string;
    DataTimeGridLD: string;
  }[];
}

export function deleteRowFromDB(id: number) {
  try {
    db.prepare("DELETE FROM GridLD WHERE NoDataGridLD = ?").run(id);
    return 1;
  } catch (err) {
    return 0;
  }
}

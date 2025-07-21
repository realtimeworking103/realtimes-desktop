import db from "../sqliteService.js";

export function createGridLDTable() {
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
        PhoneFileGridLD TEXT,
        DateTimeGridLD TIMESTAMP DEFAULT (datetime('now', 'localtime')),
        CreateAt TIMESTAMP DEFAULT (datetime('now', 'localtime'))
      )
    `,
  ).run();
}

export function getLdInstance(): {
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
}[] {
  try {
    createGridLDTable();
    
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
  } catch (error) {
    console.error("Error getting LDPlayer instances:", error);
    return [];
  }
}

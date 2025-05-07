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

export function getDataCreateLDPlayers() {
  db.prepare(
    `
      CREATE TABLE IF NOT EXISTS DataCreateLDPlayer (
        NoDataGridLD INTEGER PRIMARY KEY AUTOINCREMENT,
        LDPlayerGridLD TEXT,
        StatusGridLD TEXT,
        PrefixGridLD TEXT,
        DataTimeGridLD TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `,
  ).run();

  const rows = db
    .prepare(
      "SELECT NoDataGridLD, LDPlayerGridLD, DataTimeGridLD, StatusGridLD, PrefixGridLD FROM DataCreateLDPlayer",
    )
    .all();
  return rows as {
    NoDataGridLD: string;
    LDPlayerGridLD: string;
    DataTimeGridLD: string;
    StatusGridLD: string;
    PrefixGridLD: string;
  }[];
}

type DataCreateLDPlayerRow = {
  LDPlayerGridLD: string;
  StatusGridLD: string;
  DataTimeGridLD: string;
};

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
      StatusGridLD,
      DataTimeGridLD
    )
    VALUES (?, ?, ?)
  `);

  let moved = 0;

  for (const name of ldNames) {
    const alreadyMoved = checkIfExistsInGrid.get(name);
    if (alreadyMoved) continue;

    const row = selectFromCreate.get(name) as DataCreateLDPlayerRow;
    if (!row) continue;

    insertToGrid.run(row.LDPlayerGridLD, row.StatusGridLD, row.DataTimeGridLD);

    moved++;
  }

  return `Moved ${moved} new LDPlayer(s) to GridLD`;
}
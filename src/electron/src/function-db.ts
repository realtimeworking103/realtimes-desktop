import Database from "better-sqlite3";
import { DataCreateLDPlayerRow } from "../types/types.js";
const db = new Database("database.db");

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
        DateTimeGridLD TIMESTAMP DEFAULT (datetime('now', 'localtime'))
      )
    `,
  ).run();

  const rows = db
    .prepare(
      "SELECT NoDataGridLD, LDPlayerGridLD, StatusAccGridLD, StatusGridLD, NameLineGridLD, FriendGridLD, GroupGridLD, PhoneGridLD, TokenGridLD, DateTimeGridLD FROM GridLD",
    )
    .all();
  return rows as {
    NoDataGridLD: string;
    LDPlayerGridLD: string;
    StatusAccGridLD: string;
    StatusGridLD: string;
    NameLineGridLD: string;
    FriendGridLD: string;
    GroupGridLD: string;
    PhoneGridLD: string;
    TokenGridLD: string;
    DateTimeGridLD: string;
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
        DateTimeGridLD TIMESTAMP DEFAULT (datetime('now', 'localtime'))
      )
    `,
  ).run();

  const rows = db
    .prepare(
      "SELECT NoDataGridLD, LDPlayerGridLD, DateTimeGridLD, StatusGridLD, PrefixGridLD FROM DataCreateLDPlayer",
    )
    .all();
  return rows as {
    NoDataGridLD: string;
    LDPlayerGridLD: string;
    DateTimeGridLD: string;
    StatusGridLD: string;
    PrefixGridLD: string;
  }[];
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

export function setLDPlayerPath(path: string) {
  db.prepare(
    `
    INSERT INTO Setting (key, value)
    VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `,
  ).run("ldplayer_path", path);

  return 0;
}

export function getLDPlayerPath(): string {
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS Setting (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `,
  ).run();
  const row = db
    .prepare("SELECT value FROM Setting WHERE key = ?")
    .get("ldplayer_path") as { value: string } | undefined;
  return row?.value ?? "";
}

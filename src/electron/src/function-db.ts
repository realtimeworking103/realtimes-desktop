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
        DataTimeGridLD TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `,
  ).run();

  const rows = db
    .prepare(
      "SELECT NoDataGridLD, LDPlayerGridLD, StatusAccGridLD, StatusGridLD, DataTimeGridLD FROM GridLD",
    )
    .all();
  return rows as {
    NoDataGridLD: string;
    LDPlayerGridLD: string;
    DataTimeGridLD: string;
    StatusAccGridLD: string;
    StatusGridLD: string;
  }[];
}

export function createLDPlayerInDB(
  data: { prefix: string; generated_id: string }[],
) {
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS DataCreateLDPlayer (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prefix TEXT NOT NULL,
      generated_id TEXT NOT NULL
    )
  `,
  ).run();

  const insert = db.prepare(`
    INSERT INTO DataCreateLDPlayer (prefix, generated_id)
    VALUES (@prefix, @generated_id)
  `);

  const transaction = db.transaction(
    (items: { prefix: string; generated_id: string }[]) => {
      for (const item of items) {
        insert.run(item);
      }
    },
  );

  transaction(data);
}

export function deleteRowFromLDPlayers(id: number) {
  try {
    db.prepare("DELETE FROM GridLD WHERE NoDataGridLD = ?").run(id);
    return 1;
  } catch (err) {
    return 0;
  }
}

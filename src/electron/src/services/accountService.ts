import db from "./sqliteService.js";

export function getAccount() {
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS Account (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT,
      name TEXT,
      mid TEXT,
      status BOOLEAN,
      createAt TIMESTAMP DEFAULT (datetime('now', 'localtime'))
    )
    `,
  ).run();

  const rows = db
    .prepare("SELECT id, type, name, mid, status,  createAt FROM Account")
    .all();
  return rows as {
    id: number;
    type: string;
    name: string;
    mid: string;
    status: boolean;
    createAt: string;
  }[];
}

export function addAccount(payload: {
  type: string;
  name: string;
  mid: string;
  status: boolean;
}) {
  db.prepare(
    "INSERT INTO Account (type, name, mid, status) VALUES (?, ?, ?, ?)",
  ).run(
    payload.type,
    payload.name,
    payload.mid,
    payload.status ? 1 : 0,
  );
  return true;
}

export function deleteAccount(payload: string) {
  db.prepare("DELETE FROM Account WHERE name = ?").run(payload);
  return true;
}

export function updateAccount(payload: {
  name: string;
  type: string;
  mid: string;
  status: boolean;
}) {
  db.prepare(
    "UPDATE Account SET  name = ?, mid = ?, type = ?, status = ? WHERE name = ?",
  ).run(
    payload.name,
    payload.mid,
    payload.type,
    payload.status ? 1 : 0,
    payload.name,
  );
  return true;
}

export function saveRememberedCredentials({
  username,
  password,
}: {
  username: string;
  password: string;
}): boolean {
  try {
    db.prepare(
      `
      CREATE TABLE IF NOT EXISTS RememberedCredentials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        createdAt TIMESTAMP DEFAULT (datetime('now', 'localtime'))
      )
    `,
    ).run();

    // Delete existing record if exists
    db.prepare("DELETE FROM RememberedCredentials WHERE username = ?").run(username);

    // Insert new record
    db.prepare(
      `
      INSERT INTO RememberedCredentials (username, password)
      VALUES (?, ?)
      `,
    ).run(username, password);

    return true;
  } catch (err) {
    console.error("Error saving remembered credentials:", err);
    return false;
  }
}

export function getRememberedCredentials(): {
  username: string;
  password: string;
} | null {
  try {
    db.prepare(
      `
      CREATE TABLE IF NOT EXISTS RememberedCredentials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        createdAt TIMESTAMP DEFAULT (datetime('now', 'localtime'))
      )
    `,
    ).run();

    const row = db.prepare("SELECT username, password FROM RememberedCredentials ORDER BY id DESC LIMIT 1").get() as {
      username: string;
      password: string;
    } | undefined;

    return row || null;
  } catch (err) {
    console.error("Error getting remembered credentials:", err);
    return null;
  }
}

export function deleteRememberedCredentials(): boolean {
  try {
    db.prepare("DELETE FROM RememberedCredentials").run();
    return true;
  } catch (err) {
    console.error("Error deleting remembered credentials:", err);
    return false;
  }
}

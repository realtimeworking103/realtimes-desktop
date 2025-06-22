import { exec, execSync } from "child_process";
import db from "./config-db.js";
import { getLDConsolePath } from "./db-pathLd.js";
import { promisify } from "util";
const execAsync = promisify(exec);

export function callLdInstance(ldName: string) {
  const ldconsolePath = getLDConsolePath();
  if (!ldconsolePath) {
    console.error("[LDPlayer] Path not set in database");
    return false;
  }

  const cmd = `"${ldconsolePath}" launch --name "${ldName}"`;

  exec(cmd, (error) => {
    if (error) {
      console.error("Failed to launch LDPlayer:", error);
      db.prepare(
        "UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?",
      ).run("ไม่พบ LDPlayer", ldName);
      return;
    }
    console.log("LDPlayer launched:", ldName);
  });

  return false;
}

export function deleteLdInstance(ldName: string): Promise<boolean> {
  return new Promise((resolve) => {
    const ldconsolePath = getLDConsolePath();
    if (!ldconsolePath) {
      console.error("[LDPlayer] Path not set in database");
      db.prepare(
        "UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?",
      ).run("ไม่พบ LDPlayer", ldName);
      return resolve(false);
    }

    const cmd = `"${ldconsolePath}" remove --name "${ldName}"`;
    exec(cmd, (error) => {
      if (error) {
        console.error("Failed to delete LDPlayer:", error);
        db.prepare(
          "UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?",
        ).run("ลบไม่สำเร็จ", ldName);
        return resolve(false);
      }

      console.log("LDPlayer deleted:", ldName);
      db.prepare(
        "UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?",
      ).run("ลบ LDPlayer แล้ว", ldName);
      return resolve(true);
    });
  });
}

export function fetchLdInstance(): Promise<string[]> {
  const ldconsolePath = getLDConsolePath();
  if (!ldconsolePath) {
    console.error("[LDPlayer] Path not set in database");
    return Promise.resolve([]);
  }

  try {
    const output = execSync(`"${ldconsolePath}" list2`).toString();

    const filteredOut: string[] = [];

    const rawNames: string[] = output
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "")
      .map((line) => {
        const parts = line.split(",");
        return parts[1] ?? "";
      })
      .filter((name) => {
        const isValid =
          name !== "" &&
          name !== "LDPlayer01" &&
          name !== "????" &&
          !/�/.test(name);

        if (!isValid) filteredOut.push(name);
        return isValid;
      });

    const existing = db.prepare("SELECT LDPlayerGridLD FROM GridLD").all() as {
      LDPlayerGridLD: string;
    }[];
    const existingNames = existing.map((row) => row.LDPlayerGridLD);

    const newNames = rawNames.filter((name) => !existingNames.includes(name));

    const stmt = db.prepare(`
      INSERT INTO GridLD (LDPlayerGridLD, StatusAccGridLD, DateTimeGridLD, StatusGridLD, CreateAt)
      VALUES (?, 'บัญชีรอการสมัคร', datetime('now', 'localtime'), '', '')
    `);

    for (const name of newNames) {
      stmt.run(name);
    }

    return Promise.resolve(newNames);
  } catch (error) {
    console.error("Error fetching LDPlayers from system:", error);
    return Promise.resolve([]);
  }
}

export async function createLDPlayers({
  prefix,
  count,
  delay = 3000,
}: {
  prefix: string;
  count: number;
  delay?: number;
}): Promise<string> {
  const ldconsolePath = getLDConsolePath();
  if (!ldconsolePath) {
    console.error("[LDPlayer] Path not set in database");
    return "ไม่พบ path ของ LDPlayer";
  }

  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS DataCreateLDPlayer (
      NoDataGridLD INTEGER PRIMARY KEY AUTOINCREMENT,
      LDPlayerGridLD TEXT,
      PrefixGridLD TEXT,
      StatusGridLD TEXT,
      DateTimeGridLD TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
  ).run();

  const insertStmt = db.prepare(`
    INSERT INTO DataCreateLDPlayer
      (LDPlayerGridLD, PrefixGridLD, StatusGridLD)
    VALUES (?, ?, ?)
  `);

  const updateStatus = db.prepare(`
    UPDATE DataCreateLDPlayer
      SET StatusGridLD = ?
      WHERE LDPlayerGridLD = ?
  `);

  let successCount = 0;

  for (let i = 1; i <= count; i++) {
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, "0")}${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}${now.getFullYear()}`;

    const name = `${prefix}_${i.toString().padStart(2, "0")}${dateStr}`;
    insertStmt.run(name, prefix, "กำลังสร้าง");

    try {
      const { stdout: listOutput } = await execAsync(
        `"${ldconsolePath}" list2`,
      );
      if (listOutput.includes(name)) {
        updateStatus.run("มี LDPlayer อยู่แล้ว", name);
        continue;
      }

      await execAsync(
        `"${ldconsolePath}" copy --name "${name}" --from "LDPlayer01"`,
      );
      updateStatus.run("สร้าง LDPlayer สำเร็จ", name);
      successCount++;
    } catch (err: any) {
      console.error(`Error creating ${name}:`, err);
      updateStatus.run("สร้าง LDPlayer สำเร็จ", name);
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  return `Create LDPlayer Success ${successCount}/${count} Prefix "${prefix}"`;
}

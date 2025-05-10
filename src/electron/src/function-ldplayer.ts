import { exec, execSync } from "child_process";
import Database from "better-sqlite3";
import { promisify } from "util";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { LineProfileDecryptor } from "./function-decryptor.js";

const db = new Database("database.db");
const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputFolder = path.resolve(__dirname, "../../DatabaseLDPlayer");

function getLDConsolePath(): string {
  const row = db
    .prepare("SELECT value FROM Setting WHERE key = ?")
    .get("ldplayer_path") as { value: string } | undefined;
  return row?.value ?? "";
}

export function callLdInstance(ldName: string) {
  const ldconsolePath = getLDConsolePath();
  if (!ldconsolePath) {
    console.error("[LDPlayer] Path not set in database");
    return 0;
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

  return 0;
}

export function deleteLdInstance(ldName: string) {
  const ldconsolePath = getLDConsolePath();
  if (!ldconsolePath) {
    console.error("ไม่พบ path ของ LDPlayer");
    return 0;
  }

  const cmd = `"${ldconsolePath}" remove --name "${ldName}"`;

  exec(cmd, (error) => {
    if (error) {
      console.error("Failed to delete LDPlayer:", error);
      db.prepare(
        "UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?",
      ).run("ไม่พบ LDPlayer", ldName);
      return;
    }
    console.log("LDPlayer deleted:", ldName);
    db.prepare(
      "UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?",
    ).run("ลบ LDPlayer แล้ว", ldName);
  });

  return 0;
}

export async function decryptAndSaveProfile(ldName: string): Promise<void> {
  const pulledDbPath = path.resolve(
    __dirname,
    `../../DatabaseLDPlayer/naver_line_${ldName}.db`,
  );

  if (!fs.existsSync(pulledDbPath)) {
    console.error(`Database file not found: ${pulledDbPath}`);
    return;
  }

  const pulledDb = new Database(pulledDbPath, { readonly: true });

  try {
    const tableExists = pulledDb
      .prepare(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='setting'`,
      )
      .get();

    if (!tableExists) {
      db.prepare(
        `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
      ).run("บัญชีไม่ได้สมัคร", ldName);
      console.warn(`LDPlayer ${ldName} Not Found Table Setting`);
      return;
    }

    const decryptor = new LineProfileDecryptor(pulledDbPath);
    const profile = decryptor.decryptProfile();

    if (!profile) {
      db.prepare(
        `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
      ).run("บัญชีไม่ได้สมัคร", ldName);
      console.warn(`ถอดรหัสโปรไฟล์ล้มเหลว: ${ldName}`);
      return;
    }

    const now = new Date()
      .toLocaleString("th-TH", {
        timeZone: "Asia/Bangkok",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(/\//g, "-")
      .replace(/^(\d{2})-(\d{2})-(\d{4})/, (_, d, m, y) => `${d}-${m}-${y}`);

    db.prepare(
      `UPDATE GridLD
       SET StatusAccGridLD = ?, StatusGridLD = ?, TokenGridLD = ?, NameLineGridLD = ?, PhoneGridLD = ?, DateTimeGridLD = ?
       WHERE LDPlayerGridLD = ?`,
    ).run(
      "บัญชีไลน์พร้อมทำงาน",
      "เก็บ Token สำเร็จ",
      profile.token,
      profile.name,
      profile.phone,
      now,
      ldName,
    );

    console.log(`AuthKey: ${profile.authKey}`);
    console.log(`Token: ${profile.token}`);
    console.log(`Name: ${profile.name}`);
    console.log(`Phone: ${profile.phone}`);
    console.log(`Token saved for ${ldName}`);
  } catch (err: any) {
    console.error(`Error decrypting ${ldName}:`, err.message);
    db.prepare(
      `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
    ).run("ดึงข้อมูลล้มเหลว", ldName);
  } finally {
    pulledDb.close();
  }
}

export async function pullDBLdInstance(ldName: string): Promise<number> {
  const ldconsolePath = getLDConsolePath();
  if (!ldconsolePath) {
    console.error("ไม่พบ path ของ LDPlayer");
    return 0;
  }

  try {
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
      console.log("Created output folder:", outputFolder);
    }

    // const launchCommand = `"${ldconsolePath}" launch --name ${ldName}`;
    // await execAsync(launchCommand);
    // await new Promise((resolve) => setTimeout(resolve, 20000));

    const copyCommand = `"${ldconsolePath}" adb --name ${ldName} --command "shell su -c 'cat /data/data/jp.naver.line.android/databases/naver_line > /sdcard/naver_line_${ldName}.db'"`;
    await execAsync(copyCommand);

    const pullCommand = `"${ldconsolePath}" adb --name ${ldName} --command "pull /sdcard/naver_line_${ldName}.db ${outputFolder}"`;
    await execAsync(pullCommand);

    await decryptAndSaveProfile(ldName);

    const quitCommand = `"${ldconsolePath}" quit --name ${ldName}`;
    await execAsync(quitCommand);

    return 1;
  } catch (error) {
    console.error("Failed to pull database:", error);
    return 0;
  }
}

export function fetchLdInstance(): Promise<string[]> {
  const ldconsolePath = getLDConsolePath();
  if (!ldconsolePath) {
    console.error("ไม่พบ path ของ LDPlayer");
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
      INSERT INTO GridLD (LDPlayerGridLD, StatusAccGridLD, DateTimeGridLD, StatusGridLD)
      VALUES (?, 'บัญชีรอการสมัคร', '', '')
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

export function createLDPlayers({
  prefix,
  count,
}: {
  prefix: string;
  count: number;
}): string {
  const ldconsolePath = getLDConsolePath();
  if (!ldconsolePath) {
    console.error("ไม่พบ path ของ LDPlayer");
    return "ไม่พบ path ของ LDPlayer";
  }

  db.prepare(
    `CREATE TABLE IF NOT EXISTS DataCreateLDPlayer (
      NoDataGridLD INTEGER PRIMARY KEY AUTOINCREMENT,
      LDPlayerGridLD TEXT,
      PrefixGridLD TEXT,
      StatusGridLD TEXT,
      DateTimeGridLD TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
  ).run();

  const insertStmt = db.prepare(`
    INSERT INTO DataCreateLDPlayer (LDPlayerGridLD, PrefixGridLD, StatusGridLD)
    VALUES (?, ?, ?)
  `);

  const updateStatus = db.prepare(`
    UPDATE DataCreateLDPlayer SET StatusGridLD = ? WHERE LDPlayerGridLD = ?
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
      const listOutput = execSync(`"${ldconsolePath}" list2`, {
        encoding: "utf-8",
      });
      if (listOutput.includes(name)) {
        updateStatus.run("มี LDPlayer อยู่แล้ว", name);
        continue;
      }

      const cmd = `"${ldconsolePath}" copy --name "${name}" --from "LDPlayer01"`;
      execSync(cmd);
      updateStatus.run("สร้าง LDPlayer สำเร็จ", name);
      successCount++;
    } catch (err) {
      updateStatus.run("สร้าง LDPlayer สำเร็จ", name);
    }
  }

  return `สร้าง LDPlayer สำเร็จ ${successCount}/${count} ตัวด้วย prefix "${prefix}"`;
}

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
const outputFolder = path.resolve(__dirname, "../../pulled_databases");
const ldconsolePath = `"F:\\YORU\\LDPlayer\\LDPlayer9\\ldconsole.exe"`;

export function callLdInstance(ldName: string) {
  const cmd = `${ldconsolePath} launch --name "${ldName}"`;

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
  const cmd = `${ldconsolePath} remove --name "${ldName}"`;

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
    `../../pulled_databases/naver_line_${ldName}.db`,
  );

  if (!fs.existsSync(pulledDbPath)) {
    console.error("ไม่พบไฟล์ฐานข้อมูล:", pulledDbPath);
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
      console.warn(`⚠️ LDPlayer ${ldName} ไม่มีตาราง setting`);
      return;
    }

    const decryptor = new LineProfileDecryptor(pulledDbPath);
    const profile = decryptor.decryptProfile();

    if (!profile) {
      db.prepare(
        "UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?",
      ).run("บัญชีไม่ได้สมัคร", ldName);
      console.warn("ถอดรหัสโปรไฟล์ล้มเหลว");
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
      .replace(
        /^(\d{1,2})-(\d{1,2})-(\d{4})/,
        (_, d, m, y) => `${d.padStart(2, "0")}-${m.padStart(2, "0")}-${y}`,
      );

    db.prepare(
      `UPDATE GridLD
       SET StatusGridLD = ?, TokenGridLD = ?, NameGridLD = ?, PhoneGridLD = ?, DataTimeGridLD = ?
       WHERE LDPlayerGridLD = ?`,
    ).run(
      "เก็บ Token สำเร็จ",
      profile.token,
      profile.name,
      profile.phone,
      now,
      ldName,
    );

    console.log("ถอดรหัสสำเร็จ");
    console.log(`Token: ${profile.token}`);
    console.log(`ชื่อ: ${profile.name}`);
    console.log(`เบอร์: ${profile.phone}`);
  } catch (err: any) {
    console.error("เกิดข้อผิดพลาด:", err.message);
    db.prepare(
      "UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?",
    ).run("ดึงข้อมูลล้มเหลว", ldName);
  } finally {
    pulledDb.close();
  }
}

/**
 * เช็กและเปิด LDPlayer ก่อน pull database
 * @param ldName ชื่อ Emulator เช่น "LDPlayer01"
 */
export async function pullDBLdInstance(ldName: string): Promise<number> {
  try {
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
      console.log("Created output folder:", outputFolder);
    }

    const launchCommand = `"${ldconsolePath}" launch --name ${ldName}`;
    console.log(`Launching LDPlayer: ${ldName}`);
    await execAsync(launchCommand);

    console.log("Waiting 20 seconds for LDPlayer to boot...");
    await new Promise((resolve) => setTimeout(resolve, 20000));

    const copyCommand = `"${ldconsolePath}" adb --name ${ldName} --command "shell su -c 'cat /data/data/jp.naver.line.android/databases/naver_line > /sdcard/naver_line_${ldName}.db'"`;
    console.log(`Copying database to /sdcard: ${copyCommand}`);
    await execAsync(copyCommand);

    const pullCommand = `"${ldconsolePath}" adb --name ${ldName} --command "pull /sdcard/naver_line_${ldName}.db ${outputFolder}"`;
    console.log(`Pulling database to project folder: ${pullCommand}`);
    await execAsync(pullCommand);

    console.log("Pulled database successfully into:", outputFolder);

    await decryptAndSaveProfile(ldName);

    const quitCommand = `"${ldconsolePath}" quit --name ${ldName}`;
    console.log(`Closing LDPlayer: ${ldName}`);
    await execAsync(quitCommand);

    console.log("LDPlayer closed successfully.");
    return 1;
  } catch (error) {
    console.error("Failed to pull database:", error);
    return 0;
  }
}

export function fetchLdInstance(): Promise<string[]> {
  try {
    const output = execSync(`${ldconsolePath} list2`).toString();

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

    console.log("Emulator names filtered out:", filteredOut);

    const existing = db.prepare("SELECT LDPlayerGridLD FROM GridLD").all() as {
      LDPlayerGridLD: string;
    }[];
    const existingNames = existing.map((row) => row.LDPlayerGridLD);

    const newNames = rawNames.filter((name) => !existingNames.includes(name));

    const stmt = db.prepare(`
      INSERT INTO GridLD (LDPlayerGridLD, StatusAccGridLD, DataTimeGridLD, StatusGridLD)
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

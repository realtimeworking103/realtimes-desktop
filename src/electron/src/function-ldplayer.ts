import { exec } from "child_process";
import Database from "better-sqlite3";
import { promisify } from "util";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const db = new Database("database.db");
const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputFolder = path.resolve(__dirname, "../../pulled_databases");
const ldconsolePath = `"F:\\LDTEST\\LDPlayer\\LDPlayer9\\ldconsole.exe"`;

export function callLdInstance(name: string) {
  const cmd = `${ldconsolePath} launch --name "${name}"`;

  exec(cmd, (error) => {
    if (error) {
      console.error("Failed to launch LDPlayer:", error);
      db.prepare(
        "UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?",
      ).run("ไม่พบ LDPlayer", name);
      return;
    }
    console.log("LDPlayer launched:", name);
  });

  return 0;
}

export function deleteLdInstance(name: string) {
  const cmd = `${ldconsolePath} remove --name "${name}"`;

  exec(cmd, (error) => {
    if (error) {
      console.error("Failed to delete LDPlayer:", error);
      db.prepare(
        "UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?",
      ).run("ไม่พบ LDPlayer", name);
      return;
    }
    console.log("LDPlayer deleted:", name);
    db.prepare(
      "UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?",
    ).run("ลบ LDPlayer สำเร็จ", name);
  });

  return 0;
}

/**
 * เช็กและเปิด LDPlayer ก่อน pull database
 * @param ldName ชื่อ Emulator เช่น "LDPlayer01"
 */
export async function pullDataBase(ldName: string): Promise<number> {
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

    const quitCommand = `"${ldconsolePath}" quit --name ${ldName}`;
    console.log(`Closing LDPlayer: ${ldName}`);
    await execAsync(quitCommand);

    console.log("LDPlayer closed successfully.");

    db.prepare(
      "UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?",
    ).run("เก็บ Token สำเร็จ", ldName);

    return 1;
  } catch (error) {
    console.error("Failed to pull database:", error);
    return 0;
  }
}

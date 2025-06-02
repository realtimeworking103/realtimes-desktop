import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";
import { exec } from "child_process";

import db from "./config-db.js";
import { getLDConsolePath } from "./db-pathLd.js";
import { decryptAndSaveProfile } from "./function-decryptor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputFolder = path.resolve(__dirname, "../../databaseldplayer");
const execAsync = promisify(exec);

export async function pullDBLdInstance(ldName: string): Promise<boolean> {
  const ldconsolePath = getLDConsolePath();
  if (!ldconsolePath) {
    console.error("[LDPlayer] Path Not Setting");
    return false;
  }

  try {
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
      console.log("Create output:", outputFolder);
    }

    const launchCommand = `"${ldconsolePath}" launch --name ${ldName}`;
    await execAsync(launchCommand);

    await new Promise((resolve) => setTimeout(resolve, 20000));

    const copyCommand = `"${ldconsolePath}" adb --name ${ldName} --command "shell su -c 'cat /data/data/jp.naver.line.android/databases/naver_line > /sdcard/naver_line_${ldName}.db'"`;
    await execAsync(copyCommand);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const pullCommand = `"${ldconsolePath}" adb --name ${ldName} --command "pull /sdcard/naver_line_${ldName}.db ${outputFolder}"`;
    await execAsync(pullCommand);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    await decryptAndSaveProfile(ldName);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const quitCommand = `"${ldconsolePath}" quit --name ${ldName}`;
    await execAsync(quitCommand);

    return true;
  } catch (error: any) {
    console.error(`[${ldName}] ดึงฐานข้อมูลล้มเหลว:`, error.message);

    db.prepare(
      `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
    ).run("ดึง DB ไม่สำเร็จ", ldName);

    return false;
  }
}

export async function pullDBLdInstance2(ldName: string): Promise<boolean> {
  const ldconsolePath = getLDConsolePath();
  if (!ldconsolePath) {
    console.error("[LDPlayer] Path Not Setting");
    return false;
  }

  try {
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
      console.log("Create output:", outputFolder);
    }

    // const launchCommand = `"${ldconsolePath}" launch --name ${ldName}`;
    // await execAsync(launchCommand);

    // await new Promise((resolve) => setTimeout(resolve, 20000));

    const copyCommand = `"${ldconsolePath}" adb --name ${ldName} --command "shell su -c 'cat /data/data/jp.naver.line.android/databases/naver_line > /sdcard/naver_line_${ldName}.db'"`;
    await execAsync(copyCommand);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const pullCommand = `"${ldconsolePath}" adb --name ${ldName} --command "pull /sdcard/naver_line_${ldName}.db ${outputFolder}"`;
    await execAsync(pullCommand);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    await decryptAndSaveProfile(ldName);

    // await new Promise((resolve) => setTimeout(resolve, 1000));

    // const quitCommand = `"${ldconsolePath}" quit --name ${ldName}`;
    // await execAsync(quitCommand);

    return true;
  } catch (error: any) {
    console.error(`[${ldName}] ดึงฐานข้อมูลล้มเหลว:`, error.message);

    db.prepare(
      `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
    ).run("ดึง DB ไม่สำเร็จ", ldName);

    return false;
  }
}

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";
import { exec } from "child_process";

import db from "./config-db.js";
import { getLDConsolePath } from "./db-pathLd.js";
import { decryptAndSaveProfile } from "./function-decryptor.js";
import {
  updateSettingsAttributes1,
  updateSettingsAttributes2,
} from "./line-api/updateSettingsAttributes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputFolder = path.resolve(__dirname, "../../databaseldplayer");
const execAsync = promisify(exec);

export async function getTokenLdInstance(ldName: string): Promise<string> {
  const ldconsolePath = getLDConsolePath();
  if (!ldconsolePath) {
    console.error("[LDPlayer] Path Not Setting");
    return "";
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

    const token = await decryptAndSaveProfile(ldName);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await updateSettingsAttributes1(token);

    await updateSettingsAttributes2(token);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const quitCommand = `"${ldconsolePath}" quit --name ${ldName}`;
    await execAsync(quitCommand);

    return "";
  } catch (error: any) {
    console.error(`[${ldName}] ดึงฐานข้อมูลล้มเหลว:`, error.message);

    db.prepare(
      `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
    ).run("ดึง DB ไม่สำเร็จ", ldName);

    return "";
  }
}

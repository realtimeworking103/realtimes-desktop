import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getLdConsolePath } from "./getLdConsolePath.js";
import { execAsync } from "../execCommand.js";

import {
  updateSettingsAttributes1,
  updateSettingsAttributes2,
} from "../../line-api/updateSettingsAttributes.js";

import { decryptAndSaveProfile } from "../decryptorService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputFolder = path.resolve(__dirname, "../../../../databaseldplayer");

export async function getTokenLdInstance(ldName: string): Promise<boolean> {
  const ldconsolePath = getLdConsolePath();

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

    await new Promise((resolve) => setTimeout(resolve, 2000));

    await updateSettingsAttributes1(token);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    await updateSettingsAttributes2(token);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const quitCommand = `"${ldconsolePath}" quit --name ${ldName}`;
    await execAsync(quitCommand);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

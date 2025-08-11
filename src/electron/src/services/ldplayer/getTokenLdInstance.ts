import fs from "fs";
import path from "path";
import { getLdInstancePath } from "./getLdInstancePath.js";
import { execAsync } from "../execCommand.js";
import { decryptAndSaveProfile } from "../decryptorService.js";
import {
  updateSettingsAttributes1,
  updateSettingsAttributes2,
} from "../../line-api/updateSettingsAttributes.js";

export async function getTokenLdInstance(ldName: string): Promise<boolean> {
  const ldconsolePath = getLdInstancePath();
  const outputFolder = path.join(process.cwd(), "databaseldplayer");

  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  try {
    const launchCommand = `"${ldconsolePath}" launch --name ${ldName}`;
    await execAsync(launchCommand);

    const waitCommand = `"${ldconsolePath}" adb --name ${ldName} --command "wait-for-device"`;

    const waitResult = await Promise.race([
      execAsync(waitCommand)
        .then(() => true)
        .catch(() => false),
      new Promise<boolean>((resolve) =>
        setTimeout(() => resolve(false), 180 * 1000),
      ),
    ]);

    if (!waitResult) {
      const quitCommand = `"${ldconsolePath}" quit --name ${ldName}`;
      await execAsync(quitCommand);
      return false;
    } else {
      const copyCommand = `"${ldconsolePath}" adb --name ${ldName} --command "shell su -c 'cat /data/data/jp.naver.line.android/databases/naver_line > /sdcard/naver_line_${ldName}.db'"`;
      await execAsync(copyCommand);

      console.log("Copy Command:", copyCommand);

      const pullCommand = `"${ldconsolePath}" adb --name ${ldName} --command "pull /sdcard/naver_line_${ldName}.db ${outputFolder}"`;
      await execAsync(pullCommand);

      console.log("Pull Command:", pullCommand);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const token = await decryptAndSaveProfile(ldName);

      console.log("Token:", token);

      await new Promise((resolve) => setTimeout(resolve, 5000));

      await updateSettingsAttributes1(token);

      console.log("Update Settings Attributes 1:", token);

      await new Promise((resolve) => setTimeout(resolve, 5000));

      await updateSettingsAttributes2(token);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const quitCommand = `"${ldconsolePath}" quit --name ${ldName}`;
      await execAsync(quitCommand);

      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

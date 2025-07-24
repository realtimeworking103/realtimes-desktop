import { execAsync } from "../execCommand.js";
import db from "../sqliteService.js";
import { getLdInstancePath } from "./getLdInstancePath.js";

function createNameLdInstance(prefix: string, count: number) {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear().toString().slice(-2);
  const dateStr = `${day}${month}${year}`;

  return `${prefix}_${count.toString().padStart(2, "0")}_${dateStr}`;
}

export async function createLdInstance({
  prefix,
  count,
}: {
  prefix: string;
  count: number;
}): Promise<string> {
  const ldconsolePath = getLdInstancePath();

  const name = createNameLdInstance(prefix, count);

  const insertCreateLDPlayer = db.prepare(`
    INSERT INTO CreateLDPlayer (LDPlayerGridLD, PrefixGridLD, StatusGridLD)
    VALUES (?, ?, ?)
  `);

  const updateStatus = db.prepare(`
    UPDATE CreateLDPlayer SET StatusGridLD = ? WHERE LDPlayerGridLD = ?
  `);

  try {
    const { stdout: listOutput } = await execAsync(`"${ldconsolePath}" list2`);
    if (listOutput.includes(name)) {
      updateStatus.run("มี LDPlayer อยู่แล้ว", name);
      return `มีอยู่แล้ว: ${name}`;
    }

    await execAsync(
      `"${ldconsolePath}" copy --name "${name}" --from "LDPlayer01"`,
    );

    return `สร้าง LDPlayer สำเร็จ: ${name}`;
  } catch {
    insertCreateLDPlayer.run(name, prefix, "กำลังสร้าง LDPlayer");
    await new Promise((r) => setTimeout(r, 3000));
    updateStatus.run("สร้าง LDPlayer สำเร็จ", name);
    return `ล้มเหลว: ${name}`;
  }
}

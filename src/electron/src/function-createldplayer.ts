import { promisify } from "util";
import db from "./config-db.js";
import { getLDConsolePath } from "./db-pathLd.js";
import { exec } from "child_process";
const execAsync = promisify(exec);

export function prepareLDPlayerNames(prefix: string, count: number) {
  console.log(`xxx`);

  const stmt = db.prepare(`
    INSERT INTO DataCreateLDPlayer (LDPlayerGridLD, StatusGridLD, PrefixGridLD, DateTimeGridLD)
    VALUES (?, ?, ?, ?)
  `);

  const now = new Date().toISOString();

  for (let i = 1; i <= count; i++) {
    const number = String(i).padStart(2, "0");
    const name = `${prefix}${number}`;

    stmt.run(name, "รอสร้าง", prefix, now);
  }

  console.log(`✅ เตรียมชื่อ LDPlayer ${count} ตัวแล้ว`);
}

export async function cloneAllPendingLDPlayers() {
  const ldconsolePath = getLDConsolePath();
  if (!ldconsolePath) throw new Error("ldplayer_path not found in Setting");

  const pending = db
    .prepare(
      `SELECT LDPlayerGridLD FROM DataCreateLDPlayer WHERE StatusGridLD = 'รอสร้าง'`,
    )
    .all() as { LDPlayerGridLD: string }[];

  for (const { LDPlayerGridLD } of pending) {
    const cmd = `"${ldconsolePath}" copy --name "LDPlayer01" --newname "${LDPlayerGridLD}"`;
    console.log(`⚙️ CMD: ${cmd}`);

    try {
      await execAsync(cmd);

      db.prepare(
        `
        UPDATE DataCreateLDPlayer SET StatusGridLD = ? WHERE LDPlayerGridLD = ?
      `,
      ).run("สำเร็จ", LDPlayerGridLD);

      console.log(`✅ สร้าง ${LDPlayerGridLD} แล้ว`);
    } catch (err) {
      db.prepare(
        `
        UPDATE DataCreateLDPlayer SET StatusGridLD = ? WHERE LDPlayerGridLD = ?
      `,
      ).run("ล้มเหลว", LDPlayerGridLD);

      console.error(`❌ สร้าง ${LDPlayerGridLD} ล้มเหลว`);
    }
  }
}

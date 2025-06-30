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
        ).run(`ลบ LDPlayer แล้ว`, ldName);
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

export async function createLdInstance({
  prefix,
  count,
}: {
  prefix: string;
  count: number;
}): Promise<string> {
  const ldconsolePath = getLDConsolePath();
  if (!ldconsolePath) throw new Error("[LDPlayer] Path not set in database");

  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear().toString().slice(-2);
  const dateStr = `${day}${month}${year}`;

  const name = `${prefix}_${count.toString().padStart(2, "0")}_${dateStr}`;

  const stmt = db.prepare(`
    INSERT INTO CreateLDPlayer (LDPlayerGridLD, PrefixGridLD, StatusGridLD)
    VALUES (?, ?, ?)
  `);

  const updateStatus = db.prepare(`
    UPDATE CreateLDPlayer SET StatusGridLD = ? WHERE LDPlayerGridLD = ?
  `);

  try {
    stmt.run(name, prefix, "กำลังสร้าง LDPlayer");
  } catch {
    // ป้องกันซ้ำ
  }

  try {
    const { stdout: listOutput } = await execAsync(`"${ldconsolePath}" list2`);
    if (listOutput.includes(name)) {
      updateStatus.run("มี LDPlayer อยู่แล้ว", name);
      return `มีอยู่แล้ว: ${name}`;
    }

    await execAsync(
      `"${ldconsolePath}" copy --name "${name}" --from "LDPlayer01"`,
    );

    return `ไม่มีค่าอะไร`;
  } catch (err) {
    updateStatus.run("สร้าง LDPlayer สำเร็จ", name);
    await new Promise((r) => setTimeout(r, 3000));
    return `Create LDPlayer Success: ${name}`;
  }
}

import { execAsync } from "../execCommand.js";
import db from "../sqliteService.js";
import { getLdInstancePath } from "./getLdInstancePath.js";

export async function fetchLdInstance(): Promise<string[]> {
  const ldconsolePath = getLdInstancePath();

  try {
    const { stdout } = await execAsync(`"${ldconsolePath}" list2`);
    const filteredOut: string[] = [];

    const rawNames = stdout
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.split(",")[1] ?? "")
      .filter((name) => {
        const isValid =
          name && name !== "LDPlayer01" && name !== "????" && !/�/.test(name);

        if (!isValid) filteredOut.push(name);
        return isValid;
      });

    const existingRows = db
      .prepare("SELECT LDPlayerGridLD FROM GridLD")
      .all() as { LDPlayerGridLD: string }[];

    const existingNames = new Set(
      existingRows.map((row) => row.LDPlayerGridLD),
    );

    const newNames = rawNames.filter((name) => !existingNames.has(name));

    const insert = db.prepare(`
      INSERT INTO GridLD (
        LDPlayerGridLD,
        StatusAccGridLD,
        DateTimeGridLD,
        StatusGridLD,
        CreateAt
      ) VALUES (?, 'บัญชีรอการสมัคร', datetime('now', 'localtime'), '', '')
    `);

    for (const name of newNames) {
      insert.run(name);
    }

    return newNames;
  } catch (error) {
    console.error("Error fetching LDPlayers from system:", error);
    return [];
  }
}

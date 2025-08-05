import db from "./sqliteService.js";

export function getLineKaiLdInstance(ldName: string) {
  const row = db
    .prepare(`SELECT LineKaiGridLD FROM GridLD WHERE LDPlayerGridLD = ?`)
    .get(ldName) as { LineKaiGridLD?: string } | undefined;
  return JSON.parse(row?.LineKaiGridLD || "[]") as string[];
}

export async function updateLineKaiInstance(
  ldName: string,
  lineKaiGridLD: string[],
) {
  try {
    db.prepare(
      `UPDATE GridLD SET LineKaiGridLD = ? WHERE LDPlayerGridLD = ?`,
    ).run(JSON.stringify(lineKaiGridLD), ldName);
    return getLineKaiLdInstance(ldName);
  } catch (error) {
    console.error(error);
    return null;
  }
}

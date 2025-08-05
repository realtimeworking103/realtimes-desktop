import db from "../services/sqliteService.js";

export function getPrivateMid(privateId: string) {
  const row = db
    .prepare(`SELECT mid FROM Account WHERE name = ?`)
    .get(privateId) as { mid: string };
  return row?.mid || null;
}

export function getOaMid(oaId: string) {
  const row = db
    .prepare(`SELECT mid FROM Account WHERE name = ?`)
    .get(oaId) as { mid: string };
  return row?.mid || null;
}

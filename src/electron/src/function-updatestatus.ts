import db from "./config-db.js";

export async function updatestatus(
  status: string,
  ldName: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,).run(status, ldName);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

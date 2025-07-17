import fs from "fs";
import { syncContacts } from "./syncContacts.js";
import db from "../services/sqliteService.js";

function writePhonesToFile(phones: string[], filePath: string): void {
  fs.writeFileSync(filePath, phones.join("\n"), "utf-8");
}

export const addFriends = async (payload: {
  ldName: string;
  accessToken: string;
  target: number;
  phoneFile: string;
}): Promise<{ success: boolean; added: number; remaining: number }> => {
  const { ldName, accessToken, target, phoneFile } = payload;

  const getPathStmt = db.prepare(`SELECT path FROM Files WHERE name = ?`);
  const fileRow = getPathStmt.get(phoneFile) as { path: string };

  if (!fileRow || !fs.existsSync(fileRow.path)) {
    throw new Error(`ไม่พบไฟล์เบอร์: ${fileRow?.path || "null"}`);
  }

  const raw = fs.readFileSync(fileRow.path, "utf-8");

  const phones = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  let friendCounter = 0;
  let batchTracking = 0;
  let syncCount = 0;
  let zeroAddCount = 0;
  const usedPhones: string[] = [];

  while (
    friendCounter < target &&
    batchTracking < phones.length &&
    syncCount < 10 &&
    zeroAddCount < 10
  ) {
    const batchSize = Math.min(70, target - friendCounter);
    const slice = phones.slice(batchTracking, batchTracking + batchSize);
    batchTracking += batchSize;

    const response = await syncContacts(slice, accessToken);

    if (response === 0) {
      zeroAddCount++;
      console.warn(`add friend fail (${syncCount})`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      continue;
    } else {
      zeroAddCount = 0;
    }

    friendCounter += response;
    usedPhones.push(...slice);
    console.log(`Add Friend: ${friendCounter}/${target}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const remainingPhones = phones.filter((p) => !usedPhones.includes(p));
  writePhonesToFile(remainingPhones, fileRow.path);

  const getStmt = db.prepare(
    `SELECT FriendGridLD FROM GridLD WHERE LDPlayerGridLD = ?`,
  );

  const row = getStmt.get(ldName) as { FriendGridLD: number | null };

  const existingFriends = row?.FriendGridLD ?? 0;

  const totalFriends = Number(existingFriends) + Number(friendCounter);

  const stmt = db.prepare(
    `UPDATE GridLD SET StatusAccGridLD = ?, FriendGridLD = ?, DateTimeGridLD = datetime('now', 'localtime'), StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
  );

  stmt.run(
    `เพิ่มเพื่อนสำเร็จ`,
    `${totalFriends}`,
    `เพิ่มเพื่อนได้ ${friendCounter}/${target} คน`,
    ldName,
  );

  return {
    success: true,
    added: friendCounter,
    remaining: remainingPhones.length,
  };
};

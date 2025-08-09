import fs from "fs";
import { syncContacts } from "./syncContacts.js";
import db from "../services/sqliteService.js";

function writePhonesToFile(phones: string[], filePath: string): void {
  fs.writeFileSync(filePath, phones.join("\n"), "utf-8");
}

function deletePhones(phones: string[], filePath: string): void {
  fs.writeFileSync(filePath, phones.join("\n"), "utf-8");
}

export const addFriends = async ({
  ldName,
  accessToken,
  target,
  phoneFile,
  privatePhone,
}: {
  ldName: string;
  accessToken: string;
  target: number;
  phoneFile: string;
  privatePhone: string;
}) => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const getPathStmt = db.prepare(`SELECT path FROM Files WHERE name = ?`);
      const fileRow = getPathStmt.get(phoneFile) as { path: string };

      if (!fileRow || !fs.existsSync(fileRow.path)) {
        db.prepare(
          `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
        ).run(`ไม่พบไฟล์รายชื่อ`, ldName);

        resolve(false);
      }

      const raw = fs.readFileSync(fileRow.path, "utf-8");

      const phones = raw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      if (phones.length === 0) {
        db.prepare(
          `UPDATE GridLD SET StatusGridLD = ? WHERE LDPlayerGridLD = ?`,
        ).run(`เบอร์หมดแล้ว`, ldName);
        resolve(false);
      }

      let friendCounter = 0;
      let batchTracking = 0;
      let zeroAddCount = 0;
      const usedPhones: string[] = [];

      {
        const batchSize = Math.min(70 - 1, target);
        const sliceFromFile = phones.slice(
          batchTracking,
          batchTracking + batchSize,
        );
        batchTracking += batchSize;
        const slice = [privatePhone, ...sliceFromFile];

        try {
          const response = await syncContacts(slice, accessToken);

          if (response > 0) {
            friendCounter += response;
            usedPhones.push(...sliceFromFile);
          } else {
            zeroAddCount++;
          }

          console.log(`Add Friend (initial): ${friendCounter}/${target}`);
          deletePhones(slice, fileRow.path);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error("Error syncing contacts (initial):", error);
          zeroAddCount++;
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      while (
        friendCounter < target &&
        batchTracking < phones.length &&
        zeroAddCount < 10
      ) {
        const batchSize = Math.min(70, target - friendCounter);
        const sliceFromFile = phones.slice(
          batchTracking,
          batchTracking + batchSize,
        );
        batchTracking += batchSize;
        const slice = sliceFromFile;

        try {
          const response = await syncContacts(slice, accessToken);

          if (response === 0) {
            zeroAddCount++;
            console.warn(`add friend fail`);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            continue;
          } else {
            zeroAddCount = 0;
          }

          friendCounter += response;
          usedPhones.push(...sliceFromFile);
          console.log(`Add Friend: ${friendCounter}/${target}`);
          deletePhones(slice, fileRow.path);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error("Error syncing contacts:", error);
          zeroAddCount++;
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
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

      resolve(true);
    } catch (error) {
      console.error("Error in addFriends:", error);
      reject(error);
    }
  });
};

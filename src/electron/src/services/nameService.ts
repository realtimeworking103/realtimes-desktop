import { dialog } from "electron";
import db from "./sqliteService.js";
import fs from "fs";

export async function selectFileNameGroup() {
  try {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Text", extensions: ["txt"] }],
    });

    const filePath = result.filePaths[0];
    if (!filePath) {
      return null;
    }

    const nameGroup = fs.readFileSync(filePath, "utf8").split("\n");

    nameGroup.forEach((item) => {
      db.prepare(
        "INSERT INTO name_group (name, description, createAt) VALUES (?, ?, datetime('now'))",
      ).run(item.trim(), "");
    });
    return nameGroup as unknown as string[];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getFileNameGroup() {
  try {
    db.prepare(
      "CREATE TABLE IF NOT EXISTS name_group (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, createAt DATETIME)",
    ).run();

    const rows = db.prepare("SELECT * FROM name_group").all();
    return rows as {
      id: number;
      name: string;
      description: string;
      createAt: string;
    }[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function addNameGroup(payload: {
  name: string;
  description: string;
}) {
  try {
    const result = db
      .prepare(
        "INSERT INTO name_group (name, description, createAt) VALUES (?, ?, datetime('now'))",
      )
      .run(payload.name.trim(), payload.description.trim());
    return result.changes > 0;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function deleteNameGroup(id: number) {
  try {
    const result = db.prepare("DELETE FROM name_group WHERE id = ?").run(id);
    return result.changes > 0;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function editNameGroup(payload: {
  id: number;
  name: string;
  description: string;
}) {
  try {
    db.prepare(
      "UPDATE name_group SET name = ?, description = ? WHERE id = ?",
    ).run(payload.name.trim(), payload.description.trim(), payload.id);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

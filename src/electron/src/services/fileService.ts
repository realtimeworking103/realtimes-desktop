import { dialog } from "electron";
import db from "./sqliteService.js";
import fs from "fs/promises";
import path from "path";
export function getTxtFiles(): {
  id: number;
  name: string;
  count: number;
  path: string;
  createAt: string;
}[] {
  db.prepare(
    `
      CREATE TABLE IF NOT EXISTS Files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        count INTEGER,
        path TEXT,
        createAt TIMESTAMP DEFAULT (datetime('now', 'localtime'))
      )
    `,
  ).run();

  const rows = db.prepare("SELECT id, name, count, createAt FROM Files").all();
  return rows as {
    id: number;
    name: string;
    count: number;
    path: string;
    createAt: string;
  }[];
}

export function saveTxtFile({
  name,
  count,
  path,
}: {
  name: string;
  count: number;
  path: string;
}): boolean {
  try {
    db.prepare(
      `
      INSERT INTO Files (name, count, path)
      VALUES (?, ?, ?)
      `,
    ).run(name, count, path);

    return true;
  } catch (err) {
    console.error("Error saving file:", err);
    return false;
  }
}

export async function selectTextFile(): Promise<{
  name: string;
  path: string;
  count: number;
}> {
  try {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [
        {
          name: "Text File",
          extensions: ["txt"],
        },
        {
          name: "All File",
          extensions: ["*"],
        },
      ],
    });
    
    if (result.canceled || result.filePaths.length === 0) {
      return {
        name: "",
        path: "",
        count: 0,
      };
    }
    
    const filePath = result.filePaths[0];
    
    // Validate file exists and is readable
    try {
      await fs.access(filePath);
    } catch (error) {
      console.error("File access error:", error);
      return {
        name: "",
        path: "",
        count: 0,
      };
    }
    
    const content = await fs.readFile(filePath, "utf-8");
    const lines = content.split("\n").filter((line) => line.trim());
    
    return {
      name: path.basename(filePath, ".txt"),
      path: filePath,
      count: lines.length,
    };
  } catch (error) {
    console.error("Error in selectTextFile:", error);
    return {
      name: "",
      path: "",
      count: 0,
    };
  }
}

export function deleteTxtFile(name: string): boolean {
  try {
    const stmt = db.prepare("DELETE FROM Files WHERE name = ?");
    const result = stmt.run(name);

    return result.changes > 0;
  } catch (err) {
    console.error("Error deleting file from DB:", err);
    return false;
  }
}



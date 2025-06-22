import fs from "fs";
import path from "path";

const folderPath = path.join(process.cwd(), "contact");

export function getTxtFiles() {
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

  return fs
    .readdirSync(folderPath)
    .filter((f) => f.endsWith(".txt"))
    .map((file) => {
      const content = fs.readFileSync(path.join(folderPath, file), "utf-8");
      const count = content.split(/\r?\n/).filter((line) => line.trim()).length;
      return { name: file, count };
    });
}

export function saveTxtFile({
  name,
  data,
}: {
  name: string;
  data: Uint8Array;
}) {
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
  fs.writeFileSync(path.join(folderPath, name), Buffer.from(data));
  return true;
}

export function deleteTxtFile(fileName: string): boolean {
  const filePath = path.join(folderPath, fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}
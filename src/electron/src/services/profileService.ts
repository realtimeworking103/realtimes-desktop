import { dialog } from "electron";
import path from "path";
import fs from "fs";

export async function selectImageFile(): Promise<{
  name: string;
  path: string;
} | null> {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Images", extensions: ["jpg", "jpeg", "png"] }],
  });

  const imagePath = result.filePaths[0];
  if (!imagePath) {
    return null;
  }

  const imageName = path.basename(imagePath);

  const profilePath = path.join(process.cwd(), "profile");
  if (!fs.existsSync(profilePath)) {
    fs.mkdirSync(profilePath, { recursive: true });
  }
  fs.copyFileSync(imagePath, path.join(profilePath, imageName));

  return {
    name: imageName,
    path: imagePath,
  };
}

export async function getProfile(): Promise<
  {
    id: number;
    name: string;
    path: string;
    status: boolean;
    createAt: string;
  }[]
> {
  const profilePath = path.join(process.cwd(), "profile");
  if (!fs.existsSync(profilePath)) {
    fs.mkdirSync(profilePath, { recursive: true });
  }

  const profile = fs.readdirSync(profilePath);

  return profile.map((item) => ({
    id: profile.indexOf(item),
    name: item,
    path: path.join(profilePath, item),
    status: true,
    createAt: fs
      .statSync(path.join(profilePath, item))
      .birthtime.toLocaleString("th-TH", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
  }));
}

export async function deleteProfile(name: string): Promise<boolean> {
  const profilePath = path.join(process.cwd(), "profile");
  if (!fs.existsSync(profilePath)) {
    fs.mkdirSync(profilePath, { recursive: true });
  }
  fs.unlinkSync(path.join(profilePath, name));
  return true;
}

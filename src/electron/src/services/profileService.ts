import { dialog } from "electron";
import path from "path";

export async function selectImageFile(): Promise<{ name: string; path: string } | null> {
  try {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Images", extensions: ["jpg", "jpeg", "png", "gif", "webp"] }],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    const imagePath = result.filePaths[0];
    const imageName = path.basename(imagePath);

    return {
      name: imageName,
      path: imagePath,
    };
  } catch (error) {
    console.error("Error selecting image file:", error);
    return null;
  }
}
import { execSync } from "child_process";
import { platform } from "os";

/**
 * Get Windows SID using whoami /user command
 * @returns Promise<string> - Windows SID
 */
export async function getWindowsSID(): Promise<string> {
  try {
    const osPlatform = platform();

    if (osPlatform !== "win32") {
      throw new Error("This function is only available on Windows");
    }

    // Execute whoami /user command
    const result = execSync("whoami /user", { encoding: "utf8" });

    // Parse the output to extract SID
    const lines = result.split("\n");
    for (const line of lines) {
      if (line.includes("S-1-")) {
        // Extract SID from the line
        const sidMatch = line.match(/S-1-[0-9-]+/);
        if (sidMatch) {
          return sidMatch[0];
        }
      }
    }

    throw new Error("SID not found in whoami output");
  } catch (error) {
    console.error("Error getting Windows SID:", error);

    // Fallback: return a default or error indicator
    return "SID_ERROR";
  }
}

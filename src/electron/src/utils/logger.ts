import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export class Logger {
  private static instance: Logger;
  private logDir: string;
  private currentLogFile: string;

  private constructor() {
    this.logDir = path.join(__dirname, "../../../logs");
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
    this.currentLogFile = path.join(this.logDir, `app-${new Date().toISOString().split('T')[0]}.log`);
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const levelStr = LogLevel[level];
    const dataStr = data ? ` | Data: ${JSON.stringify(data)}` : "";
    return `[${timestamp}] [${levelStr}] ${message}${dataStr}`;
  }

  private writeToFile(message: string): void {
    try {
      fs.appendFileSync(this.currentLogFile, message + "\n", "utf-8");
    } catch (error) {
      console.error("Error writing to log file:", error);
    }
  }

  public debug(message: string, data?: any): void {
    const formattedMessage = this.formatMessage(LogLevel.DEBUG, message, data);
    console.debug(formattedMessage);
    this.writeToFile(formattedMessage);
  }

  public info(message: string, data?: any): void {
    const formattedMessage = this.formatMessage(LogLevel.INFO, message, data);
    console.info(formattedMessage);
    this.writeToFile(formattedMessage);
  }

  public warn(message: string, data?: any): void {
    const formattedMessage = this.formatMessage(LogLevel.WARN, message, data);
    console.warn(formattedMessage);
    this.writeToFile(formattedMessage);
  }

  public error(message: string, error?: any): void {
    const errorData = error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : undefined;
    const formattedMessage = this.formatMessage(LogLevel.ERROR, message, errorData);
    console.error(formattedMessage);
    this.writeToFile(formattedMessage);
  }
}

export const logger = Logger.getInstance(); 
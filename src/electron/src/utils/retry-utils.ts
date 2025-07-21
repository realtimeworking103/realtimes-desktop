import { logger } from "./logger.js";
import { configManager } from "../config/app-config.js";

export interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
  onRetry?: (attempt: number, error: any) => void;
}

export class RetryUtils {
  public static async withRetry<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const {
      maxAttempts = configManager.getRetryAttempts(),
      delay = configManager.getRetryDelay(),
      backoff = true,
      onRetry
    } = options;

    let lastError: any;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxAttempts) {
          logger.error(`Operation failed after ${maxAttempts} attempts`, error);
          throw error;
        }

        const currentDelay = backoff ? delay * Math.pow(2, attempt - 1) : delay;
        
        logger.warn(`Operation failed (attempt ${attempt}/${maxAttempts}), retrying in ${currentDelay}ms`, {
          error: error instanceof Error ? error.message : String(error),
          attempt,
          maxAttempts,
          delay: currentDelay
        });

        if (onRetry) {
          onRetry(attempt, error);
        }

        await this.sleep(currentDelay);
      }
    }

    throw lastError;
  }

  public static async withRetryForNetwork<T>(
    operation: () => Promise<T>,
    customOptions?: RetryOptions
  ): Promise<T> {
    const options: RetryOptions = {
      maxAttempts: configManager.getRetryAttempts(),
      delay: configManager.getRetryDelay(),
      backoff: true,
      onRetry: (attempt, error) => {
        logger.warn(`Network operation failed, retrying...`, {
          attempt,
          error: error instanceof Error ? error.message : String(error),
          timeout: configManager.getNetworkTimeout()
        });
      },
      ...customOptions
    };

    return this.withRetry(operation, options);
  }

  public static async withRetryForDatabase<T>(
    operation: () => Promise<T>,
    customOptions?: RetryOptions
  ): Promise<T> {
    const options: RetryOptions = {
      maxAttempts: 3,
      delay: 1000,
      backoff: true,
      onRetry: (attempt, error) => {
        logger.warn(`Database operation failed, retrying...`, {
          attempt,
          error: error instanceof Error ? error.message : String(error)
        });
      },
      ...customOptions
    };

    return this.withRetry(operation, options);
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
} 
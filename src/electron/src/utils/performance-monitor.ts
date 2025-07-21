import { logger } from "./logger.js";

export interface PerformanceMetrics {
  operationName: string;
  duration: number;
  success: boolean;
  error?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 1000; // Keep last 1000 metrics

  private constructor() {}

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public async measureOperation<T>(
    operationName: string,
    operation: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const startTime = Date.now();
    const startTimestamp = new Date();

    try {
      const result = await operation();
      const duration = Date.now() - startTime;

      this.recordMetric({
        operationName,
        duration,
        success: true,
        timestamp: startTimestamp,
        metadata
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.recordMetric({
        operationName,
        duration,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: startTimestamp,
        metadata
      });

      throw error;
    }
  }

  public measureSyncOperation<T>(
    operationName: string,
    operation: () => T,
    metadata?: Record<string, any>
  ): T {
    const startTime = Date.now();
    const startTimestamp = new Date();

    try {
      const result = operation();
      const duration = Date.now() - startTime;

      this.recordMetric({
        operationName,
        duration,
        success: true,
        timestamp: startTimestamp,
        metadata
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.recordMetric({
        operationName,
        duration,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: startTimestamp,
        metadata
      });

      throw error;
    }
  }

  private recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);

    // Keep only the last maxMetrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log slow operations
    if (metric.duration > 5000) { // 5 seconds
      logger.warn(`Slow operation detected: ${metric.operationName}`, {
        duration: metric.duration,
        success: metric.success,
        metadata: metric.metadata
      });
    }

    // Log failed operations
    if (!metric.success) {
      logger.error(`Operation failed: ${metric.operationName}`, {
        duration: metric.duration,
        error: metric.error,
        metadata: metric.metadata
      });
    }
  }

  public getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  public getMetricsByOperation(operationName: string): PerformanceMetrics[] {
    return this.metrics.filter(m => m.operationName === operationName);
  }

  public getAverageDuration(operationName: string): number {
    const operationMetrics = this.getMetricsByOperation(operationName);
    if (operationMetrics.length === 0) return 0;

    const totalDuration = operationMetrics.reduce((sum, m) => sum + m.duration, 0);
    return totalDuration / operationMetrics.length;
  }

  public getSuccessRate(operationName: string): number {
    const operationMetrics = this.getMetricsByOperation(operationName);
    if (operationMetrics.length === 0) return 0;

    const successfulOperations = operationMetrics.filter(m => m.success).length;
    return successfulOperations / operationMetrics.length;
  }

  public getRecentMetrics(limit: number = 100): PerformanceMetrics[] {
    return this.metrics.slice(-limit);
  }

  public clearMetrics(): void {
    this.metrics = [];
  }

  public generateReport(): {
    totalOperations: number;
    averageDuration: number;
    successRate: number;
    slowOperations: PerformanceMetrics[];
    failedOperations: PerformanceMetrics[];
  } {
    if (this.metrics.length === 0) {
      return {
        totalOperations: 0,
        averageDuration: 0,
        successRate: 0,
        slowOperations: [],
        failedOperations: []
      };
    }

    const totalDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    const averageDuration = totalDuration / this.metrics.length;
    const successfulOperations = this.metrics.filter(m => m.success).length;
    const successRate = successfulOperations / this.metrics.length;
    const slowOperations = this.metrics.filter(m => m.duration > 5000);
    const failedOperations = this.metrics.filter(m => !m.success);

    return {
      totalOperations: this.metrics.length,
      averageDuration,
      successRate,
      slowOperations,
      failedOperations
    };
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance(); 
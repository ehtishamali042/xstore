import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  // In a real app, this would go to a file or external service
  private logs: string[] = [];

  /**
   * Log an informational message
   */
  log(message: string, context?: string) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [INFO] ${context ? `[${context}] ` : ''}${message}`;
    console.log(logMessage);
    this.logs.push(logMessage);
  }

  /**
   * Log an error message
   */
  error(message: string, trace?: string, context?: string) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [ERROR] ${context ? `[${context}] ` : ''}${message}`;
    console.error(logMessage);
    if (trace) {
      console.error(trace);
    }
    this.logs.push(logMessage);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: string) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [WARN] ${context ? `[${context}] ` : ''}${message}`;
    console.warn(logMessage);
    this.logs.push(logMessage);
  }

  /**
   * Get all logs (for debugging/admin purposes)
   */
  getAllLogs(): string[] {
    return this.logs;
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }
}

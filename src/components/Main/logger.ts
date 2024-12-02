type LogLevel = "info" | "warn" | "error" | "debug";

interface LoggerOptions {
  context?: string;
}

class Logger {
  private static instance: Logger;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogLevel, context: string, message: string, data?: any) {
    if (process.env.NODE_ENV === "development") {
      const timestamp = new Date().toISOString();
      const contextStr = context ? `[${context}]` : "";
      const dataStr = data ? JSON.stringify(data) : "";

      switch (level) {
        case "error":
          console.error(`${timestamp} ${contextStr} ${message}`, dataStr);
          break;
        case "warn":
          console.warn(`${timestamp} ${contextStr} ${message}`, dataStr);
          break;
        case "info":
          console.info(`${timestamp} ${contextStr} ${message}`, dataStr);
          break;
        case "debug":
          console.debug(`${timestamp} ${contextStr} ${message}`, dataStr);
          break;
      }
    }
  }

  info(message: string, data?: any, options?: LoggerOptions) {
    this.log("info", options?.context || "", message, data);
  }

  warn(message: string, data?: any, options?: LoggerOptions) {
    this.log("warn", options?.context || "", message, data);
  }

  error(message: string, data?: any, options?: LoggerOptions) {
    this.log("error", options?.context || "", message, data);
  }

  debug(message: string, data?: any, options?: LoggerOptions) {
    this.log("debug", options?.context || "", message, data);
  }
}

export const logger = Logger.getInstance();

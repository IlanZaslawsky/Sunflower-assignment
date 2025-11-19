export class Logger {
  private static formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  static info(message: string): void {
    console.log(this.formatMessage('INFO', message));
  }

  static step(message: string): void {
    console.log(`\n${this.formatMessage('STEP', message)}`);
  }

  static success(message: string): void {
    console.log(this.formatMessage('SUCCESS', message));
  }

  static error(message: string): void {
    console.error(this.formatMessage('ERROR', message));
  }

  static action(message: string): void {
    console.log(`  ${message}`);
  }

  static data(key: string, value: string): void {
    console.log(`  ${key}: ${value}`);
  }
}


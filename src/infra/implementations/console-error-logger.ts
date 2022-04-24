import { ErrorLogger } from '@interface-adapters/interfaces/logger';

export class ConsoleErrorLogger implements ErrorLogger {
  async log(error: Error): Promise<void> {
    console.log('Error name', error.name);
    console.log('Error message', error.message);
    console.log('Error stack trace', error.stack);
  }
}

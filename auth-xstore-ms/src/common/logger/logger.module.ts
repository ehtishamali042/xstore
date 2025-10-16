import { Module, Global } from '@nestjs/common';
import { LoggerService } from './logger.service';

// @Global() makes this module available EVERYWHERE without importing
// Remove @Global() if you want explicit imports in each module
@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService], // ← KEY: Export so other modules can use it
})
export class LoggerModule {}

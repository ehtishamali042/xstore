import { Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { InterceptorsModule } from './interceptors/interceptors.module';

@Module({
  imports: [LoggerModule, InterceptorsModule],
})
export class CommonModule {}

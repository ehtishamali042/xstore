import { Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { InterceptorsModule } from './interceptors/interceptors.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [LoggerModule, InterceptorsModule, PrismaModule],
})
export class CommonModule {}

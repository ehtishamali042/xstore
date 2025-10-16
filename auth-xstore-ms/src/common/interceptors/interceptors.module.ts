import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logging.interceptor';

/**
 * 🏗️ INTERCEPTORS MODULE
 *
 * 📚 Learning: Global Interceptors
 * - APP_INTERCEPTOR token makes interceptor global
 * - Applies to ALL routes automatically
 * - No need to manually apply to each controller
 *
 * Alternative approaches:
 * 1. Global in main.ts: app.useGlobalInterceptors(new LoggingInterceptor())
 * 2. Controller level: @UseInterceptors(LoggingInterceptor)
 * 3. Method level: @UseInterceptors(LoggingInterceptor) on specific routes
 */
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class InterceptorsModule {}

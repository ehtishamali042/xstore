import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { LoggerModule } from './common/logger/logger.module';
import { AuthModule } from './auth/auth.module';
import { InterceptorsModule } from './common/interceptors/interceptors.module';

/**
 * 🏗️ ROOT APPLICATION MODULE
 *
 * 📚 Learning: Module Import Order & Interceptors
 * - LoggerModule: Global module (marked @Global), available everywhere
 * - InterceptorsModule: Registers global HTTP logging interceptor
 * - AuthModule: Provides authentication services and guards
 * - UsersModule: Now protected by JWT authentication
 *
 * Module Dependencies:
 * - AuthModule depends on UsersModule (imports it)
 * - UsersModule depends on EmailModule and LoggerModule
 * - All modules can use LoggerModule (it's @Global)
 * - Interceptor runs on ALL HTTP requests automatically
 */
@Module({
  imports: [
    LoggerModule, // ← Register logger globally
    InterceptorsModule, // ← Register HTTP logging interceptor globally
    AuthModule, // ← Add authentication module
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

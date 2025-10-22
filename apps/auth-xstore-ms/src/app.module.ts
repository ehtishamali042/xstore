import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { LoggerModule } from './common/logger/logger.module';
import { AuthModule } from './auth/auth.module';
import { InterceptorsModule } from './common/interceptors/interceptors.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

/**
 * 🏗️ ROOT APPLICATION MODULE
 *
 * 📚 Learning: Module Import Order & Global Guards
 * - LoggerModule: Global module (marked @Global), available everywhere
 * - InterceptorsModule: Registers global HTTP logging interceptor
 * - AuthModule: Provides authentication services and guards
 * - UsersModule: Now protected by JWT authentication
 * - JwtAuthGuard: Global guard #1 - authenticates ALL routes
 * - RolesGuard: Global guard #2 - checks roles when @Roles() is present
 *
 * Module Dependencies:
 * - AuthModule depends on UsersModule (imports it)
 * - UsersModule depends on EmailModule and LoggerModule
 * - All modules can use LoggerModule (it's @Global)
 * - Interceptor runs on ALL HTTP requests automatically
 *
 * Guard Execution Order:
 * 1. JwtAuthGuard (authenticates, sets req.user)
 * 2. RolesGuard (checks roles if @Roles() present)
 * 3. Route Handler
 */
@Module({
  imports: [
    LoggerModule, // ← Register logger globally
    InterceptorsModule, // ← Register HTTP logging interceptor globally
    AuthModule, // ← Add authentication module
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 🔐 Global JwtAuthGuard - authenticates ALL routes
    // Runs FIRST to set req.user
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // 🔐 Global RolesGuard - checks roles on routes with @Roles()
    // Runs SECOND (after JwtAuthGuard sets req.user)
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}

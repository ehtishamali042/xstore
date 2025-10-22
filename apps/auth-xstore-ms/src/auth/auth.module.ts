import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RolesGuard } from './guards/roles.guard';
import { UsersModule } from '../users/users.module';

/**
 * 🏗️ AUTH MODULE - Authentication module using @xstore/auth-utils
 *
 * 📚 Learning: Removed Passport Dependency
 * - Previously: Used PassportModule and JwtStrategy
 * - Now: Using @xstore/auth-utils validateToken in JwtAuthGuard
 * - Benefit: Direct control over JWT validation, shared logic across microservices
 *
 * What's still here:
 * - JwtModule: For generating tokens (login/register)
 * - AuthService: Business logic for auth operations
 * - UsersModule: Access to user data
 */
@Module({
  imports: [
    // Import UsersModule to access UsersService in AuthService
    UsersModule,

    // Configure JWT module for TOKEN GENERATION (not validation)
    JwtModule.register({
      // 🔑 Secret key to sign tokens
      // ⚠️ Must match the secret used in @xstore/auth-utils validateToken
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',

      // Token expiration time
      signOptions: {
        expiresIn: '24h', // Token valid for 24 hours
      },
    }),
  ],

  // Controllers handling auth routes
  controllers: [AuthController],

  // Providers available in this module
  // AuthService: business logic for authentication
  // RolesGuard: role-based authorization
  providers: [AuthService, RolesGuard],

  // Export AuthService and RolesGuard so other modules can use them
  exports: [AuthService, RolesGuard],
})
export class AuthModule {}

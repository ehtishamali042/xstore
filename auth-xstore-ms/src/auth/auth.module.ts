import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

/**
 * 🏗️ AUTH MODULE - Central authentication module
 *
 * 📚 Learning: Module Organization
 * 1. Imports: External modules this module depends on
 * 2. Controllers: HTTP endpoints for this module
 * 3. Providers: Services and strategies available in this module
 * 4. Exports: What other modules can use from this module
 *
 * Key Concepts Demonstrated:
 * - JWT Configuration: Secret key, token expiration
 * - Passport Integration: Using passport-jwt strategy
 * - Module Dependencies: Importing UsersModule to access UsersService
 * - Service Export: Exporting AuthService so other modules can use it
 */
@Module({
  imports: [
    // Import UsersModule to access UsersService in AuthService
    // This demonstrates inter-module dependency!
    UsersModule,

    // Register Passport with default strategy as 'jwt'
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Configure JWT module
    JwtModule.register({
      // 🔑 Secret key to sign tokens (MUST be same in JwtStrategy)
      // ⚠️ In production: Use environment variables, not hardcoded!
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',

      // Token expiration time
      // '1h' = 1 hour, '7d' = 7 days, '60s' = 60 seconds
      signOptions: {
        expiresIn: '24h', // Token valid for 24 hours
      },
    }),
  ],

  // Controllers handling auth routes
  controllers: [AuthController],

  // Providers available in this module
  // AuthService: business logic
  // JwtStrategy: how to validate JWT tokens
  providers: [AuthService, JwtStrategy],

  // Export AuthService and JwtStrategy so other modules can use them
  // This allows other modules to validate tokens and check authentication
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}

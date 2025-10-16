import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { User } from '../../users/entities/user.entity';

/**
 * 🔑 JWT STRATEGY - How to validate JWT tokens
 *
 * 📚 Learning: This is a Passport Strategy
 * - Passport is a popular authentication middleware
 * - A strategy defines HOW to authenticate (in this case, using JWT)
 * - This strategy runs automatically on routes protected by JwtAuthGuard
 *
 * How JWT Strategy works:
 * 1. Extracts JWT from Authorization header (Bearer <token>)
 * 2. Verifies the token using the secret key
 * 3. Calls validate() method with decoded payload
 * 4. If valid, attaches user to request object (req.user)
 * 5. If invalid, throws UnauthorizedException
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      // Where to find the JWT token? In Authorization header as Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Should we ignore expired tokens? NO!
      ignoreExpiration: false,
      // Secret key to verify token signature (should match JwtModule config)
      secretOrKey:
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    });
  }

  /**
   * VALIDATE method - Called automatically after JWT is verified
   * @param payload - Decoded JWT payload { sub: userId, email, role }
   * @returns User object that will be attached to request (req.user)
   *
   * 🎯 This is where you can add additional validation:
   * - Check if user still exists in database
   * - Check if user account is active
   * - Check if user has required permissions
   */
  validate(payload: { sub: string; email: string; role: string }): User {
    const user = this.authService.validateToken(payload);

    if (!user) {
      throw new UnauthorizedException('User not found or token invalid');
    }

    // Whatever you return here will be available as req.user in controllers
    return user;
  }
}

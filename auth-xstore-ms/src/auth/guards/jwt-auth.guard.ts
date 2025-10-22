import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { validateToken } from '@xstore/auth-utils';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * 🔒 CUSTOM JWT AUTH GUARD using @xstore/auth-utils
 *
 * This guard validates JWTs using the shared auth-utils package.
 * It replaces Passport's AuthGuard('jwt') to demonstrate direct usage of validateToken.
 *
 * Features:
 * - Extracts Bearer token from Authorization header
 * - Uses validateToken from @xstore/auth-utils for verification
 * - Respects @Public() decorator
 * - Sets req.user with decoded payload
 *
 * 📚 Learning: Why we replaced Passport
 * - Previously: AuthGuard('jwt') used Passport JWT strategy
 * - Now: Direct validation using @xstore/auth-utils
 * - Benefit: Same validation logic across all microservices
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked as @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      console.log('🔓 Public route - skipping authentication');
      return true;
    }

    console.log('🔐 Protected route - validating JWT with @xstore/auth-utils');

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // 🎯 USING @xstore/auth-utils validateToken!
      const secret =
        process.env.JWT_SECRET || 'your-secret-key-change-in-production';
      const result = await validateToken(token, secret);

      if (!result.valid || !result.payload) {
        throw new UnauthorizedException(result.error || 'Invalid token');
      }

      console.log('✅ Token validated successfully:', result.payload.email);

      // Attach user payload to request
      (request as any).user = result.payload;
      return true;
    } catch (error) {
      console.error('❌ Token validation failed:', error);
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Token validation failed',
      );
    }
  }

  /**
   * Extract Bearer token from Authorization header
   */
  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
      return null;
    }

    const [type, token] = parts;
    return type === 'Bearer' ? token : null;
  }
}

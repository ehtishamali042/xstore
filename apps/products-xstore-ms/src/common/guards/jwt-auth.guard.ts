import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { validateToken } from '@xstore/auth-utils';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header found');
    }

    const jwtSecret =
      process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const result = await validateToken(authHeader, jwtSecret);

    if (!result.valid) {
      throw new UnauthorizedException(result.error || 'Invalid token');
    }

    // Attach user info to request for use in controllers
    request.user = result.payload;
    return true;
  }
}

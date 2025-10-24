import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { validateToken } from '@xstore/auth-utils';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header found');
    }

    const jwtSecret =
      this.configService.get<string>('JWT_SECRET') ||
      'your-secret-key-change-in-production';
    const result = await validateToken(authHeader, jwtSecret);

    if (!result.valid) {
      throw new UnauthorizedException(result.error || 'Invalid token');
    }

    // Attach user info to request for use in controllers
    request.user = result.payload;
    return true;
  }
}

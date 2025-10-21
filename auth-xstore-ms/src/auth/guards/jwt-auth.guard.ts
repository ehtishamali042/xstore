import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * 🛡️ JWT AUTH GUARD - Protects routes requiring authentication
 *
 * 📚 Learning: What are Guards?
 * - Guards determine whether a request should be handled by the route
 * - They execute BEFORE the route handler
 * - If guard returns true → request proceeds
 * - If guard returns false → request is rejected (401 Unauthorized)
 *
 * 📚 Learning: Global Guards with @Public() Decorator
 * - When used as a global guard, it protects ALL routes by default
 * - Use @Public() decorator to mark routes as public (no auth required)
 * - Checks for @Public() metadata before enforcing authentication
 *
 * How to use:
 * @UseGuards(JwtAuthGuard)  // or just use it globally
 * async getProfile(@Request() req) {
 *   return req.user; // User from JWT token
 * }
 *
 * Mark routes as public:
 * @Public()
 * @Post('login')
 * login() { ... }  // No authentication required
 *
 * 🔍 What happens when this guard is applied:
 * 1. Check if route has @Public() decorator → skip auth
 * 2. Guard extracts JWT token from request
 * 3. JwtStrategy validates the token
 * 4. If valid, user is attached to request (req.user)
 * 5. If invalid, 401 Unauthorized is returned
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // Method level @Public()
      context.getClass(), // Controller level @Public()
    ]);

    if (isPublic) {
      console.log('🔓 Public route - skipping authentication');
      return true; // Skip authentication for public routes
    }

    // Call the parent class's canActivate (which uses JwtStrategy)
    console.log('🔐 Protected route - checking authentication');
    return super.canActivate(context);
  }
}

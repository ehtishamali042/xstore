import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * 🛡️ JWT AUTH GUARD - Protects routes requiring authentication
 *
 * 📚 Learning: What are Guards?
 * - Guards determine whether a request should be handled by the route
 * - They execute BEFORE the route handler
 * - If guard returns true → request proceeds
 * - If guard returns false → request is rejected (401 Unauthorized)
 *
 * How to use:
 * @UseGuards(JwtAuthGuard)
 * async getProfile(@Request() req) {
 *   return req.user; // User from JWT token
 * }
 *
 * 🔍 What happens when this guard is applied:
 * 1. Guard extracts JWT token from request
 * 2. JwtStrategy validates the token
 * 3. If valid, user is attached to request (req.user)
 * 4. If invalid, 401 Unauthorized is returned
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Call the parent class's canActivate (which uses JwtStrategy)
    return super.canActivate(context);
  }
}

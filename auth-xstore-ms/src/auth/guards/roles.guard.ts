import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { User } from '../../users/entities/user.entity';

/**
 * 🔐 ROLES GUARD - Custom Authorization Guard
 *
 * 📚 Learning: Custom Guards
 * - Implements CanActivate interface
 * - Uses Reflector to read metadata from decorators
 * - Checks if user has required role
 * - Works AFTER JwtAuthGuard (requires authenticated user)
 *
 * How it works:
 * 1. Reads @Roles() decorator metadata
 * 2. Gets user from request (populated by JwtAuthGuard)
 * 3. Checks if user's role matches required roles
 * 4. Returns true (allow) or false (deny)
 *
 * Usage:
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Roles(Role.ADMIN, Role.MODERATOR)
 * deleteUser() { ... }
 */

// Define the request type with user
interface RequestWithUser extends Request {
  user: User;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Get required roles from @Roles() decorator
    // If no roles specified, allow access (no restriction)
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(), // Method level @Roles()
      context.getClass(), // Controller level @Roles()
    ]);

    // If no @Roles() decorator, skip role checking
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No roles required, allow access
    }

    // 2. Get user from request (set by JwtAuthGuard)
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    // 3. Check if user exists and has a role
    // Since JwtAuthGuard runs BEFORE RolesGuard (both global), user should always exist
    if (!user || !user.role) {
      console.log(
        '❌ RolesGuard: User not authenticated or has no role. ' +
          'This should not happen if JwtAuthGuard is configured correctly.',
      );
      return false; // Deny access - user not authenticated properly
    }

    // 4. Check if user's role is in the required roles
    const hasRole = requiredRoles.includes(user.role);

    // Log for debugging
    if (hasRole) {
      console.log(
        `✅ Access Granted: User ${user.email} (${user.role}) ` +
          `accessing route requiring roles: ${requiredRoles.join(', ')}`,
      );
    } else {
      console.log(
        `❌ Access Denied: User ${user.email} (${user.role}) ` +
          `attempted to access route requiring roles: ${requiredRoles.join(', ')}`,
      );
    }

    return hasRole;
  }
}

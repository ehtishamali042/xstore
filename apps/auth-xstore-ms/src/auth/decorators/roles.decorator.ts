import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

/**
 * 🏷️ ROLES DECORATOR - Custom Metadata Decorator
 *
 * 📚 Learning: Custom Decorators
 * - SetMetadata stores custom information on route handlers
 * - This data is read by RolesGuard using Reflector
 * - Makes code cleaner and more readable
 *
 * How it works:
 * @Roles('admin') → stores ['admin'] in metadata with key 'roles'
 * RolesGuard reads this metadata and checks user's role
 *
 * Usage:
 * @Roles('admin')                    // Single role
 * @Roles('admin', 'moderator')       // Multiple roles (OR condition)
 * @Roles('user')                     // Any logged-in user with 'user' role
 */
/**
 * Roles decorator - now type safe with Role enum
 * Usage: @Roles(Role.ADMIN), @Roles(Role.OBSERVER, Role.NETSECOPS)
 */
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);

/**
 * Examples:
 *
 * 1. Admin only:
 *    @Roles('admin')
 *    deleteUser() {}
 *
 * 2. Admin or Moderator:
 *    @Roles('admin', 'moderator')
 *    moderateContent() {}
 *
 * 3. All authenticated users:
 *    @UseGuards(JwtAuthGuard)  // No @Roles needed
 *    getProfile() {}
 */

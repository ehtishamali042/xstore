import { SetMetadata } from '@nestjs/common';

/**
 * 🔓 PUBLIC DECORATOR - Mark routes as public (no authentication required)
 *
 * 📚 Learning: Metadata Decorators
 * - SetMetadata stores custom information on route handlers
 * - JwtAuthGuard reads this metadata to skip authentication
 * - Makes routes accessible without JWT token
 *
 * Usage:
 * @Public()
 * @Post('login')
 * login() { ... }
 *
 * This tells JwtAuthGuard to skip authentication for this route
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

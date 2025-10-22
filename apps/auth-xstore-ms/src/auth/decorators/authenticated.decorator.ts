import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

/**
 * 🔐 AUTHENTICATED DECORATOR - Cleaner Syntax
 *
 * 📚 Learning: Custom Composite Decorators
 * - Wraps @UseGuards(JwtAuthGuard) for cleaner code
 * - Makes intent clearer: "This route requires authentication"
 * - Reduces boilerplate
 *
 * Usage:
 * @Authenticated()  // ← Clean and clear!
 * getProfile() {}
 *
 * Instead of:
 * @UseGuards(JwtAuthGuard)  // ← More verbose
 * getProfile() {}
 */
export function Authenticated() {
  return UseGuards(JwtAuthGuard);
}

/**
 * 💡 Benefits:
 * 1. Cleaner, more semantic code
 * 2. Easy to change implementation (just update one place)
 * 3. Can be extended with more logic
 * 4. Self-documenting code
 */

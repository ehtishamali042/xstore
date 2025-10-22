/**
 * @xstore/auth-utils
 *
 * Shared JWT validation utilities for microservices
 *
 * CORE USAGE (works anywhere - Node.js, TypeScript, any framework):
 *
 * ```typescript
 * import { validateToken, decodeToken } from '@xstore/auth-utils';
 *
 * const result = await validateToken(token, 'your-secret');
 * if (result.valid) {
 *   console.log(result.payload); // { userId, email, roles, ... }
 * }
 * ```
 *
 * OPTIONAL NESTJS GUARD:
 *
 * ```typescript
 * import { JwtAuthGuard } from '@xstore/auth-utils/nestjs';
 *
 * @UseGuards(JwtAuthGuard)
 * @Controller('products')
 * export class ProductsController { ... }
 * ```
 */

// Core utilities - pure TypeScript, no framework dependencies
export { validateToken, decodeToken } from "./jwt-validator";
export type { JwtPayload, TokenValidationResult } from "./types";

import * as jwt from "jsonwebtoken";
import type { JwtPayload, TokenValidationResult } from "./types";

/**
 * Validates a JWT token
 *
 * @param token - The JWT token to validate (with or without 'Bearer ' prefix)
 * @param secret - The secret key used to sign the token
 * @returns Validation result with payload if valid
 *
 * @example
 * ```typescript
 * const result = await validateToken(token, process.env.JWT_SECRET);
 * if (result.valid) {
 *   console.log('User ID:', result.payload.userId);
 *   console.log('Email:', result.payload.email);
 * } else {
 *   console.error('Invalid token:', result.error);
 * }
 * ```
 */
export async function validateToken(
  token: string,
  secret: string
): Promise<TokenValidationResult> {
  try {
    // Remove 'Bearer ' prefix if present
    const cleanToken = token.replace(/^Bearer\s+/i, "");

    const payload = jwt.verify(cleanToken, secret) as JwtPayload;
    return {
      valid: true,
      payload,
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Invalid token",
    };
  }
}

/**
 * Decodes a JWT token without verification (useful for inspecting expired tokens)
 *
 * @param token - The JWT token to decode
 * @returns Decoded payload or null if token is malformed
 *
 * @example
 * ```typescript
 * const payload = decodeToken(token);
 * if (payload) {
 *   console.log('Token expired at:', new Date(payload.exp * 1000));
 * }
 * ```
 */
export function decodeToken(token: string): JwtPayload | null {
  try {
    const cleanToken = token.replace(/^Bearer\s+/i, "");
    return jwt.decode(cleanToken) as JwtPayload;
  } catch {
    return null;
  }
}

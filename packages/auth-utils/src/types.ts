/**
 * JWT Payload structure
 * Extend this interface in your microservice if you need additional fields
 */
export interface JwtPayload {
  /** User ID */
  sub: string;

  /** User email */
  email: string;

  /** User role */
  role: string;

  /** Issued at timestamp (seconds since epoch) */
  iat?: number;

  /** Expiration timestamp (seconds since epoch) */
  exp?: number;

  /** Token issuer */
  iss?: string;

  /** Token audience */
  aud?: string;

  /** Additional custom fields */
  [key: string]: any;
}

/**
 * Result of token validation
 */
export interface TokenValidationResult {
  /** Whether the token is valid */
  valid: boolean;

  /** Decoded payload if valid */
  payload?: JwtPayload;

  /** Error message if invalid */
  error?: string;
}

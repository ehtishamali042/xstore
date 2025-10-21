/**
 * 🎭 ROLE ENUM - Defines all available user roles
 *
 * Using an enum provides:
 * 1. Type safety - TypeScript will catch invalid roles at compile time
 * 2. Autocomplete - IDEs will suggest valid roles
 * 3. Single source of truth - Change roles in one place
 */
export enum Role {
  USER = 'user', // Regular users - basic access
  ADMIN = 'admin', // Administrators - full access
  OBSERVER = 'observer', // Can view but not modify
  NETSECOPS = 'netsecops', // Network security operations - security-related access
}

/**
 * Helper function to check if a string is a valid role
 */
export function isValidRole(role: string): role is Role {
  return Object.values(Role).includes(role as Role);
}

/**
 * Get all role values as an array
 */
export function getAllRoles(): Role[] {
  return Object.values(Role);
}

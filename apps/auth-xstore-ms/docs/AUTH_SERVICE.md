# Auth Service

## Overview

Handles user authentication, JWT token generation, and password security.

**Location:** `src/auth/auth.service.ts`

## Core Responsibilities

1. User registration (signup)
2. User login (signin)
3. Password hashing with bcrypt
4. JWT token generation and validation

## Key Methods

### `register(registerDto: RegisterDto)`

Creates new user account.

**Process:**

1. Check if email already exists
2. Hash password with bcrypt (10 salt rounds)
3. Create user with hashed password
4. Generate JWT token
5. Return token + user info (without password)

**Returns:** `{ access_token, user }`

### `login(loginDto: LoginDto)`

Authenticates existing user.

**Process:**

1. Validate credentials with `validateUser()`
2. Generate JWT token
3. Return token + user info

**Returns:** `{ access_token, user }`

### `validateUser(email: string, password: string)`

Validates user credentials.

**Process:**

1. Find user by email
2. Compare plain password with hashed password using `bcrypt.compare()`
3. Return user if valid, `null` if invalid

**Used by:** Login flow and Passport strategies

### `validateToken(payload)`

Verifies JWT token payload.

**Process:**

1. Extract user ID from token payload
2. Fetch user from database
3. Return user (attached to `req.user`)

**Used by:** JwtStrategy automatically

## JWT Token Structure

**Payload:**

```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "admin",
  "iat": 1697443200,
  "exp": 1697529600
}
```

**Configuration:** Set in `auth.module.ts`

```typescript
JwtModule.register({
  secret: process.env.JWT_SECRET || 'your-secret-key',
  signOptions: { expiresIn: '24h' },
});
```

## Password Security

**Hashing:**

- Uses bcrypt with 10 salt rounds
- One-way encryption (cannot be reversed)
- Each hash is unique even for same password

**Validation:**

- `bcrypt.compare()` hashes input and compares
- Never stores or compares plain text passwords

## Roles

Available roles defined in `auth/enums/role.enum.ts`:

- `USER` - Regular users, basic access
- `ADMIN` - Full system access
- `OBSERVER` - Read-only access
- `NETSECOPS` - Security operations access

## Dependencies

```typescript
constructor(
  private usersService: UsersService,  // User CRUD operations
  private jwtService: JwtService       // Token generation
)
```

## Error Handling

- `ConflictException` - Email already exists (409)
- `UnauthorizedException` - Invalid credentials (401)

## Example Usage

```typescript
// Register
const result = await authService.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'secure123',
  role: Role.USER,
});

// Login
const result = await authService.login({
  email: 'john@example.com',
  password: 'secure123',
});
```

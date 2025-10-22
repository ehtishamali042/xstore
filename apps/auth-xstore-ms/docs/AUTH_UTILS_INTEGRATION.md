# @xstore/auth-utils Integration

## Overview

The `auth-xstore-ms` service now uses the `@xstore/auth-utils` package for JWT validation instead of Passport.js. This provides a **shared validation logic** that can be used across all microservices.

## What Changed

### ❌ Removed

- **Passport dependencies**: `@nestjs/passport`, `passport`, `passport-jwt`
- **JWT Strategy**: `src/auth/strategies/jwt.strategy.ts` (no longer needed)
- **Passport imports**: Removed from `auth.module.ts`

### ✅ Added

- **@xstore/auth-utils package**: Installed from `../packages/auth-utils`
- **Custom JWT Guard**: Updated `jwt-auth.guard.ts` to use `validateToken` directly

## How It Works

### Before (with Passport)

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Passport handles token validation behind the scenes
  canActivate(context: ExecutionContext) {
    return super.canActivate(context); // Delegates to Passport
  }
}
```

**Flow**: Request → Guard → Passport → JwtStrategy.validate() → Controller

### After (with @xstore/auth-utils)

```typescript
@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = this.extractTokenFromHeader(request);

    // 🎯 Direct validation using auth-utils
    const result = await validateToken(token, secret);

    if (!result.valid) {
      throw new UnauthorizedException(result.error);
    }

    request.user = result.payload;
    return true;
  }
}
```

**Flow**: Request → Guard → validateToken() → Controller

## Key Benefits

1. **Shared Logic**: Same validation code across all microservices
2. **No Framework Lock-in**: Works with any Node.js framework
3. **Direct Control**: Explicit validation flow, easier to debug
4. **Consistency**: All services validate tokens the same way

## Code Locations

### JWT Guard with validateToken

```typescript
// File: src/auth/guards/jwt-auth.guard.ts
import { validateToken } from '@xstore/auth-utils';

async canActivate(context: ExecutionContext): Promise<boolean> {
  // Extract token from Authorization header
  const token = this.extractTokenFromHeader(request);

  // Validate using auth-utils
  const result = await validateToken(token, process.env.JWT_SECRET);

  if (!result.valid || !result.payload) {
    throw new UnauthorizedException(result.error || 'Invalid token');
  }

  // Attach payload to request
  request.user = result.payload;
  return true;
}
```

### Token Generation (unchanged)

```typescript
// File: src/auth/auth.service.ts
// Still using @nestjs/jwt for token generation
async login(loginDto: LoginDto) {
  const payload = { sub: user.id, email: user.email, role: user.role };
  return {
    access_token: this.jwtService.sign(payload), // Generate token
  };
}
```

## Protected Routes

All routes are protected by default since `JwtAuthGuard` is registered globally in `app.module.ts`:

```typescript
// Users controller - automatically protected
@Controller('users')
export class UsersController {
  @Get()
  findAll(@Request() req) {
    console.log('Authenticated user:', req.user.email); // From validateToken
    return this.usersService.findAll();
  }
}
```

## Public Routes

Use `@Public()` decorator to bypass authentication:

```typescript
@Public()
@Post('login')
async login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}
```

## Testing the Integration

### 1. Start the server

```bash
npm run start:dev
```

### 2. Register a user (Public route)

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### 3. Login to get token (Public route)

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 4. Access protected route with token

```bash
curl http://localhost:3000/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Console output** (from validateToken):

```
🔐 Protected route - validating JWT with @xstore/auth-utils
✅ Token validated successfully: test@example.com
```

### 5. Try without token (should fail)

```bash
curl http://localhost:3000/users
```

Response:

```json
{
  "statusCode": 401,
  "message": "No token provided"
}
```

## Environment Variables

Both token **generation** (JwtService) and **validation** (validateToken) must use the **same secret**:

```env
JWT_SECRET=your-secret-key-change-in-production
```

## Using in Other Microservices

To add JWT validation to another microservice:

### 1. Install the package

```bash
npm install ../packages/auth-utils
```

### 2. Create a guard

```typescript
import { validateToken } from '@xstore/auth-utils';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractToken(request);

    const result = await validateToken(token, process.env.JWT_SECRET);

    if (!result.valid) {
      throw new UnauthorizedException(result.error);
    }

    request.user = result.payload;
    return true;
  }
}
```

### 3. Register globally

```typescript
@Module({
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
```

That's it! Now all microservices validate JWTs the same way. 🎯

# @xstore/auth-utils

**Ultra-lightweight JWT validation for microservices** - Just 2 functions!

## 🎯 Purpose

Each microservice validates JWT tokens **independently**, without calling the auth service. This eliminates latency and single point of failure.

## 📦 Installation

```bash
npm install @xstore/auth-utils
# or if local: npm install ../packages/auth-utils
```

## 🚀 Usage

### Basic Validation

```typescript
import { validateToken } from "@xstore/auth-utils";

const result = await validateToken(token, process.env.JWT_SECRET);

if (result.valid) {
  console.log("User ID:", result.payload.sub);
  console.log("Email:", result.payload.email);
  console.log("Role:", result.payload.role);
} else {
  console.error("Invalid token:", result.error);
  // Return 401 Unauthorized
}
```

### Express Middleware

```typescript
import { validateToken } from "@xstore/auth-utils";

const authMiddleware = async (req, res, next) => {
  const result = await validateToken(
    req.headers.authorization,
    process.env.JWT_SECRET
  );

  if (!result.valid) {
    return res.status(401).json({ error: result.error });
  }

  req.user = result.payload;
  next();
};

app.use("/api/protected", authMiddleware);
```

### NestJS Guard (Easy!)

```typescript
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { validateToken } from '@xstore/auth-utils';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const result = await validateToken(token, process.env.JWT_SECRET);

    if (!result.valid) {
      throw new UnauthorizedException(result.error);
    }

    request.user = result.payload;
    return true;
  }
}

// Use it:
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController { ... }
```

## 📚 API

### `validateToken(token, secret)`

Validates a JWT token.

**Parameters:**

- `token` (string): JWT token (with or without 'Bearer ' prefix)
- `secret` (string): Secret key used to sign tokens

**Returns:**

```typescript
{
  valid: boolean;
  payload?: {
    sub: string;      // User ID
    email: string;
    role: string;
    iat?: number;
    exp?: number;
  };
  error?: string;
}
```

### `decodeToken(token)`

Decodes a JWT without verification (useful for debugging).

**Returns:** Payload or `null`

## 🏗️ Architecture

```
Auth Service (generates JWT)
    ↓
Client (stores JWT)
    ↓
Products/Orders/Users Services (validate locally with @xstore/auth-utils)
    ✅ No auth service call needed!
```

## 🔐 Security

1. **Use the same JWT_SECRET** across all microservices
2. **Store secret in environment variables**
3. **Never commit secrets** to git

## 📝 License

MIT

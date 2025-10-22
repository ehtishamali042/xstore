# Setting Up a New Microservice with @xstore/auth-utils

## Quick Start for New Services

### Step 1: Install the Package

```bash
cd your-new-service
npm install ../../packages/auth-utils
# or if published to npm: npm install @xstore/auth-utils
```

### Step 2: Set Environment Variable

Create `.env` file:

```env
JWT_SECRET=your-secret-key-change-in-production
```

**IMPORTANT:** Use the **same JWT_SECRET** across all microservices!

### Step 3a: NestJS Setup (Recommended)

```typescript
// src/main.ts or app.module.ts
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "@xstore/auth-utils/nestjs";

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Now all routes are protected!
    },
  ],
})
export class AppModule {}
```

That's it! All your routes are now protected. The `req.user` object will contain the JWT payload.

### Step 3b: Express/Other Framework Setup

```typescript
import express from "express";
import { validateToken } from "@xstore/auth-utils";

const app = express();

// Create middleware
async function authMiddleware(req, res, next) {
  const result = await validateToken(
    req.headers.authorization,
    process.env.JWT_SECRET
  );

  if (!result.valid) {
    return res.status(401).json({ error: result.error });
  }

  req.user = result.payload;
  next();
}

// Apply to all routes
app.use(authMiddleware);

// Or apply to specific routes
app.use("/api/protected", authMiddleware);
```

### Step 4: Use in Your Controllers

```typescript
@Controller("products")
export class ProductsController {
  @Get()
  findAll(@Request() req) {
    // req.user is automatically populated by the guard
    const userId = req.user.sub;
    const userEmail = req.user.email;
    const userRole = req.user.role;

    return this.productsService.findAll(userId);
  }
}
```

## Testing with JWT Tokens

### Get a token from auth service:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### Use token in your new service:

```bash
curl -X GET http://localhost:3001/products \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Common Patterns

### Role-Based Access Control

```typescript
import { validateToken } from "@xstore/auth-utils";

async function requireAdmin(req, res, next) {
  const result = await validateToken(
    req.headers.authorization,
    process.env.JWT_SECRET
  );

  if (!result.valid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (result.payload.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  req.user = result.payload;
  next();
}
```

### Optional Auth (Public + Protected Endpoints)

```typescript
// Don't apply guard globally, apply per-route
@Controller("products")
export class ProductsController {
  @Get("public")
  findPublic() {
    return this.productsService.findPublicProducts();
  }

  @UseGuards(JwtAuthGuard)
  @Get("private")
  findPrivate(@Request() req) {
    return this.productsService.findUserProducts(req.user.sub);
  }
}
```

## Architecture Benefits

✅ **No Single Point of Failure:** Auth service down? Other services still validate tokens!  
✅ **Lower Latency:** No network call to auth service for every request  
✅ **Scalability:** Each service validates independently  
✅ **Simplicity:** Just one function call to validate tokens

## Troubleshooting

### "Invalid signature" error

- Check that all services use the **same JWT_SECRET**
- Verify the secret matches the one used to generate tokens

### "Token expired" error

- Token has expired, client needs to login again
- Or adjust token expiration time in auth service

### "No token provided" error

- Client forgot to send Authorization header
- Or header format is wrong (should be `Bearer <token>`)

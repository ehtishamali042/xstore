# Usage Examples

## Example 1: Simple Function

```typescript
import { validateToken } from "@xstore/auth-utils";

async function checkAuth(authHeader: string) {
  const result = await validateToken(authHeader, process.env.JWT_SECRET);

  if (result.valid) {
    console.log(`✅ User ${result.payload.email} authenticated`);
    return result.payload;
  } else {
    console.log(`❌ Authentication failed: ${result.error}`);
    throw new Error("Unauthorized");
  }
}
```

## Example 2: Express Middleware

```typescript
import express from "express";
import { validateToken } from "@xstore/auth-utils";

const app = express();

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

// Use the middleware
app.get("/products", authMiddleware, (req, res) => {
  res.json({
    message: `Hello ${req.user.email}`,
    products: [],
  });
});
```

## Example 3: NestJS Service

```typescript
// products.service.ts
import { Injectable } from "@nestjs/common";
import { JwtAuthGuard } from "@xstore/auth-utils/nestjs";

@UseGuards(JwtAuthGuard)
@Controller("products")
export class ProductsController {
  @Get()
  findAll(@Request() req) {
    // req.user contains the JWT payload
    return {
      user: req.user.email,
      products: this.productsService.findAll(),
    };
  }
}
```

## Example 4: Plain HTTP Server

```typescript
import http from "http";
import { validateToken } from "@xstore/auth-utils";

const server = http.createServer(async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    res.writeHead(401);
    res.end(JSON.stringify({ error: "No token provided" }));
    return;
  }

  const result = await validateToken(token, process.env.JWT_SECRET);

  if (!result.valid) {
    res.writeHead(401);
    res.end(JSON.stringify({ error: result.error }));
    return;
  }

  res.writeHead(200);
  res.end(
    JSON.stringify({
      message: "Authenticated!",
      user: result.payload,
    })
  );
});

server.listen(3000);
```

## Example 5: Decode Without Validation (Debugging)

```typescript
import { decodeToken } from "@xstore/auth-utils";

// Useful for checking expired tokens or debugging
const token = "Bearer eyJhbGc...";
const payload = decodeToken(token);

if (payload) {
  console.log("Token was issued at:", new Date(payload.iat * 1000));
  console.log("Token expires at:", new Date(payload.exp * 1000));
  console.log("User:", payload.email);
}
```

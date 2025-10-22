# JWT Auth Guard for Products Service (Copy This!)

When you create your Products service, copy this guard:

## File: `src/common/guards/jwt-auth.guard.ts`

```typescript
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { validateToken } from "@xstore/auth-utils";

/**
 * Simple JWT Auth Guard using @xstore/auth-utils
 *
 * This guard validates JWT tokens without Passport.js
 * Much simpler than the auth service setup!
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("No authorization header provided");
    }

    // Validate token using the shared utility
    const result = await validateToken(authHeader, process.env.JWT_SECRET);

    if (!result.valid) {
      throw new UnauthorizedException(result.error || "Invalid token");
    }

    // Attach user payload to request
    request.user = result.payload;
    return true;
  }
}
```

## Usage in Products Service:

### Apply Globally (Protect All Routes):

```typescript
// app.module.ts
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
```

### Or Apply Per-Controller:

```typescript
// products.controller.ts
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("products")
export class ProductsController {
  @Get()
  findAll(@Req() req) {
    console.log("User:", req.user); // { sub, email, role }
    return this.productsService.findAll();
  }
}
```

## That's It!

**15 lines of code** vs the complex Passport setup in auth service!

This is why we kept auth service as-is (it already works) but future services use this simpler approach. 🎯

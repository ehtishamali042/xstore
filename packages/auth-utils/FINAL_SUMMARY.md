# ✅ @xstore/auth-utils - FINAL VERSION

## What You Got

**Ultra-minimal JWT validation package** - Just what you need, nothing more!

### Package Structure (Clean!)
```
packages/auth-utils/
├── src/
│   ├── index.ts           # Exports validateToken & decodeToken
│   ├── jwt-validator.ts   # Core validation logic (~50 lines)
│   └── types.ts           # TypeScript interfaces
├── dist/                  # Compiled JS (built ✅)
├── package.json           # Clean, no peer deps
├── README.md              # Full documentation
└── EXAMPLES.md            # Code examples
```

### What It Does

**2 functions. That's it.**

1. `validateToken(token, secret)` - Validates JWT tokens
2. `decodeToken(token)` - Decodes without validation

### Why This is Perfect

✅ **Minimal** - No NestJS dependencies, no bloat  
✅ **Universal** - Works in ANY Node.js/TypeScript project  
✅ **Simple** - Just one function call  
✅ **No errors** - Everything compiles cleanly  
✅ **Fast** - Each service validates locally (no auth service calls)

## How to Use

### In Any Service

```typescript
import { validateToken } from '@xstore/auth-utils';

const result = await validateToken(token, process.env.JWT_SECRET);
if (result.valid) {
  // User authenticated!
  console.log(result.payload.email);
}
```

### In NestJS (Write Your Own Guard - 10 lines!)

```typescript
@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const result = await validateToken(req.headers.authorization, process.env.JWT_SECRET);
    if (!result.valid) throw new UnauthorizedException();
    req.user = result.payload;
    return true;
  }
}
```

See? Super easy to write your own guard when needed!

## Installation

```bash
# In your auth-service or any microservice
npm install ../packages/auth-utils
```

## Next Steps

1. **Test it** in your auth-xstore-ms service
2. **Use it** when you create products-service, orders-service, etc.
3. **Enjoy** fast, independent JWT validation!

## The Architecture

```
┌──────────────┐
│ Auth Service │ ──> Generates JWT tokens
└──────────────┘
       ↓
┌──────────────┐
│   Client     │ ──> Stores JWT in localStorage/cookie
└──────────────┘
       ↓
       ├─────────────────┬─────────────────┐
       ↓                 ↓                 ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Products    │  │   Orders     │  │    Users     │
│  Service     │  │   Service    │  │   Service    │
│              │  │              │  │              │
│ validateToken│  │ validateToken│  │ validateToken│
│   (local)    │  │   (local)    │  │   (local)    │
└──────────────┘  └──────────────┘  └──────────────┘

✅ Each service validates independently
✅ No network calls to auth service
✅ Faster responses
✅ No single point of failure
```

## You Made the Right Choice!

By keeping it simple:
- ✅ No confusing NestJS modules
- ✅ No peer dependency warnings
- ✅ No IDE errors
- ✅ Universal compatibility
- ✅ Easy to understand and maintain

**One function. That's all you need.** ��

# Architecture Overview

## Structure

```
auth-xstore-ms/
├── src/
│   ├── main.ts              # Application entry point
│   ├── app.module.ts        # Root module
│   │
│   ├── auth/                # Authentication module
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── guards/
│   │   ├── decorators/
│   │   └── strategies/
│   │
│   ├── users/               # User management module
│   │   ├── users.service.ts
│   │   ├── users.controller.ts
│   │   ├── dto/
│   │   └── entities/
│   │
│   └── common/              # Shared utilities
│       ├── logger/
│       ├── email/
│       └── interceptors/
```

## Module Dependencies

```
AppModule (root)
├── LoggerModule (global)
├── InterceptorsModule (global logging)
├── AuthModule
│   └── imports UsersModule
└── UsersModule
    ├── imports LoggerModule
    └── imports EmailModule
```

## Request Flow

### Public Routes

```
Request → @Public() check → Route Handler
```

### Protected Routes

```
Request → JwtAuthGuard (validate token) → Route Handler
                ↓
            set req.user
```

### Role-Protected Routes

```
Request → JwtAuthGuard → RolesGuard → Route Handler
          (authenticate)  (check role)
```

## Global Guards

Registered in `app.module.ts`:

```typescript
providers: [
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard, // Runs first
  },
  {
    provide: APP_GUARD,
    useClass: RolesGuard, // Runs second
  },
];
```

**Execution order:**

1. `JwtAuthGuard` - authenticates and sets `req.user`
2. `RolesGuard` - checks roles if `@Roles()` present

## API Endpoints

### Auth Routes (Public)

- `POST /auth/register` - Create account
- `POST /auth/login` - Get JWT token

### User Routes (Protected)

- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user (admin only)
- `DELETE /users/:id` - Delete user (admin only)

## Key Technologies

- **NestJS** - Framework
- **Passport** - Authentication middleware
- **JWT** - Token-based auth
- **bcrypt** - Password hashing
- **class-validator** - DTO validation

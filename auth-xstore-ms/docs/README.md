# Authentication Microservice Documentation# Auth Microservice Documentation

JWT-based authentication service with role-based access control.JWT authentication system with role-based access control (RBAC) for NestJS.

## Quick Links## Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System structure and data flow1. **[AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md)** - JWT authentication basics

- **[AUTH_SERVICE.md](./AUTH_SERVICE.md)** - Authentication service details2. **[GUARDS.md](./GUARDS.md)** - Global guards setup and usage

- **[USERS_SERVICE.md](./USERS_SERVICE.md)** - User management service3. **[ROLES.md](./ROLES.md)** - Role-based access control

4. **[API_TESTING.md](./API_TESTING.md)** - API testing guide

## Quick Start

## Quick Start

### Register User

`bash`bash

curl -X POST http://localhost:3000/auth/register \# Register a user

-H "Content-Type: application/json" \POST /auth/register

-d '{

    "name": "John Doe",# Login

    "email": "john@example.com",POST /auth/login

    "password": "secure123"

}'# Access protected route

```GET /users (requires JWT token)

```

### Login

````bash## Key Concepts

curl -X POST http://localhost:3000/auth/login \

  -H "Content-Type: application/json" \**Authentication Flow:**

  -d '{

    "email": "john@example.com",```

    "password": "secure123"Registration → Password Hash → JWT Token

  }'Login → Validate Password → JWT Token

```Protected Route → Validate Token → Access Granted

````

### Access Protected Route

````bash**Guard Execution:**

curl -X GET http://localhost:3000/users \

  -H "Authorization: Bearer YOUR_TOKEN_HERE"```

```Request → JwtAuthGuard → RolesGuard → Handler

          (authenticates)  (checks roles)

## API Endpoints```



### Public Routes### Available Roles

- `POST /auth/register` - Create account

- `POST /auth/login` - Get JWT token- **USER** - Regular users with basic access

- **ADMIN** - Administrators with full access

### Protected Routes- **OBSERVER** - Can view but not modify

- `GET /users` - List all users (requires auth)- **NETSECOPS** - Network security operations team

- `GET /users/:id` - Get user (requires auth)

- `POST /users` - Create user (admin only)## 📝 Common Tasks

- `DELETE /users/:id` - Delete user (admin only)

### Make a Route Public (No Auth Required)

## Roles

```typescript

- `USER` - Regular user access@Public()

- `ADMIN` - Full system access@Get('info')

- `OBSERVER` - Read-only accessgetInfo() { ... }

- `NETSECOPS` - Security operations```



## Security### Protect a Route (Auth Required)



- Passwords hashed with bcrypt (10 rounds)```typescript

- JWT tokens expire in 24 hours// No decorator needed - all routes are protected by default

- Global guards protect all routes@Get('profile')

- Role-based access controlgetProfile(@Request() req: { user: User }) { ... }

````

## Development

### Add Role-Based Protection

```````bash

# Install dependencies```typescript

npm install@Roles(Role.ADMIN)

@Get('admin/dashboard')

# Run development servergetDashboard() { ... }

npm run start:dev```



# Run tests### Multiple Roles (OR condition)

npm run test

``````typescript

@Roles(Role.ADMIN, Role.NETSECOPS)
@Get('security/audit')
getAudit() { ... }
```````

## 🔧 System Architecture

### Global Guards

- **JwtAuthGuard**: Registered globally, runs on ALL routes
  - Skips routes marked with `@Public()`
  - Validates JWT tokens
  - Sets `req.user` for authenticated requests

- **RolesGuard**: Registered globally, runs after JwtAuthGuard
  - Only activates when `@Roles()` decorator is present
  - Checks if `req.user.role` matches required roles
  - Returns 403 Forbidden if role doesn't match

### DTOs with Validation

- All DTOs use `class-validator` decorators
- Role validation uses `@IsEnum(Role)`
- Password minimum length: 6 characters
- Email format validation

### Services

- **AuthService**: Registration, login, token validation
- **UsersService**: User CRUD operations
- **LoggerService**: Structured logging (global)
- **EmailService**: Email notifications

## 🐛 Troubleshooting

**Problem: Can't access protected routes**

- Check: Do you have a valid JWT token?
- Check: Is the token in `Authorization: Bearer <token>` header?
- See: **TEST_API.md** for correct request format

**Problem: Getting 403 Forbidden on role-protected routes**

- Check: Does your user have the required role?
- Check: Are you using the correct role enum value?
- See: **RBAC_TESTING_GUIDE.md** for testing different roles

**Problem: Guards not working as expected**

- Check: Are both guards registered globally?
- Check: Is @Public() decorator on public routes?
- See: **GLOBAL_GUARDS_FIX.md** for detailed troubleshooting

## 📚 Additional Resources

- [NestJS Guards Documentation](https://docs.nestjs.com/guards)
- [JWT (JSON Web Tokens) Introduction](https://jwt.io/introduction)
- [Passport.js Documentation](http://www.passportjs.org/)
- [class-validator Documentation](https://github.com/typestack/class-validator)

## 🎓 Learning Path

### Beginner

1. Understand basic authentication (AUTHENTICATION_GUIDE.md)
2. Learn about guards (GUARDS_EXPLAINED.md)
3. Test the API (TEST_API.md)

### Intermediate

1. Implement role-based access control (MULTI_ROLE_GUIDE.md)
2. Test RBAC scenarios (RBAC_TESTING_GUIDE.md)
3. Understand global guards (GLOBAL_GUARDS_FIX.md)

### Advanced

1. Customize guards for your use case
2. Implement resource-level permissions
3. Add refresh token mechanism
4. Integrate with database (TypeORM/Prisma)

## 🔄 Last Updated

These docs reflect the current state of the authentication system with:

- ✅ Global JwtAuthGuard and RolesGuard
- ✅ @Public() decorator for public routes
- ✅ 4 role types (USER, ADMIN, OBSERVER, NETSECOPS)
- ✅ Type-safe Role enum
- ✅ Complete DTO validation
- ✅ Structured logging

---

Happy coding! 🚀 If you have questions, check the relevant guide above or refer to the inline code comments.

# 🔐 JWT Authentication - Testing Guide

## 📚 What You've Built

You now have a complete JWT authentication system with:

- ✅ User registration (signup)
- ✅ User login (signin)
- ✅ Protected routes with JWT guards
- ✅ Password hashing with bcrypt
- ✅ JWT token generation and validation

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Client                                │
│  (Browser, Postman, Mobile App)                             │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    NestJS Application                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  AuthModule                                           │  │
│  │  • POST /auth/register - Create account              │  │
│  │  • POST /auth/login - Get JWT token                  │  │
│  │  • AuthService - Business logic                      │  │
│  │  • JwtStrategy - Token validation                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  UsersModule (Protected with JwtAuthGuard)           │  │
│  │  • GET /users - List all users (requires token)     │  │
│  │  • GET /users/:id - Get user (requires token)       │  │
│  │  • POST /users - Create user (requires token)       │  │
│  │  • DELETE /users/:id - Delete user (requires token) │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Key Concepts Learned

### 1. **JWT (JSON Web Tokens)**

- Stateless authentication - server doesn't store sessions
- Token contains user info (id, email, role)
- Token is signed with a secret key
- Format: `header.payload.signature`

### 2. **Passport Strategies**

- **JwtStrategy**: How to validate JWT tokens
- Extracts token from `Authorization: Bearer <token>` header
- Verifies token signature
- Attaches user to request object

### 3. **Guards**

- Protect routes from unauthorized access
- Execute BEFORE route handlers
- `@UseGuards(JwtAuthGuard)` on a controller = ALL routes protected
- `@UseGuards(JwtAuthGuard)` on a method = ONLY that route protected

### 4. **Password Hashing**

- NEVER store plain text passwords!
- bcrypt hashes passwords with salt
- Hashing is one-way - can't reverse it
- `bcrypt.compare()` checks if password matches hash

### 5. **Module Privacy**

- Services are private by default
- Use `exports: [ServiceName]` to share with other modules
- AuthModule imports UsersModule to access UsersService
- UsersModule exports UsersService so AuthModule can use it

## 🧪 Testing the API

### Test 1: Register a New User (Signup)

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "password": "secure123",
    "role": "user"
  }'
```

**Expected Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "4",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "user"
  }
}
```

**What Happens:**

1. AuthService checks if email already exists
2. Password is hashed using bcrypt
3. User is created in UsersService
4. JWT token is generated with user info
5. Token + user info returned (NO password!)

---

### Test 2: Login (Signin)

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "secure123"
  }'
```

**Expected Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "4",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "user"
  }
}
```

**What Happens:**

1. AuthService finds user by email
2. bcrypt compares provided password with stored hash
3. If valid, JWT token is generated
4. Token + user info returned

---

### Test 3: Access Protected Route WITHOUT Token (Should Fail)

```bash
curl -X GET http://localhost:3000/users
```

**Expected Response: 401 Unauthorized**

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**What Happens:**

1. JwtAuthGuard checks for Authorization header
2. No token found
3. Request is rejected with 401

---

### Test 4: Access Protected Route WITH Token (Should Work)

First, copy the `access_token` from Test 1 or Test 2, then:

```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Replace `YOUR_ACCESS_TOKEN_HERE` with the actual token!**

**Expected Response: 200 OK**

```json
[
  {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "password": "temp123",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "2",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "temp123",
    "role": "user",
    "createdAt": "2024-01-02T00:00:00.000Z"
  },
  ...
]
```

**What Happens:**

1. JwtAuthGuard extracts token from Authorization header
2. JwtStrategy validates token signature
3. User info is attached to request (req.user)
4. Request proceeds to controller
5. UsersController returns all users

---

### Test 5: Get Single User (Protected)

```bash
curl -X GET http://localhost:3000/users/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Expected Response: 200 OK**

```json
{
  "id": "1",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "temp123",
  "role": "admin",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 🔍 Understanding JWT Tokens

### Decode Your Token

Go to [https://jwt.io](https://jwt.io) and paste your token to see what's inside:

**Payload:**

```json
{
  "sub": "4", // User ID
  "email": "alice@example.com",
  "role": "user",
  "iat": 1697443200, // Issued at timestamp
  "exp": 1697529600 // Expiration timestamp (24 hours later)
}
```

### Token Expiration

- Current setting: 24 hours (`expiresIn: '24h'`)
- After expiration, users must login again
- Change in `auth.module.ts`: `signOptions: { expiresIn: '7d' }` for 7 days

---

## 🛠️ Common Issues & Solutions

### Issue 1: "Unauthorized" even with token

**Solution:** Check if token is expired or properly formatted

- Must be: `Authorization: Bearer <token>`
- No extra spaces or quotes

### Issue 2: "User with this email already exists"

**Solution:** Email is already registered. Use a different email or test login instead.

### Issue 3: "Invalid credentials"

**Solution:** Wrong email or password. Check spelling and case-sensitivity.

---

## 🎓 Next Steps for Learning

### 1. **Add Password Validation**

Use `class-validator` to enforce password rules:

```typescript
// In register.dto.ts
@MinLength(8)
@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
password: string;
```

### 2. **Add Email Validation**

```typescript
@IsEmail()
email: string;
```

### 3. **Add Role-Based Access Control (RBAC)**

Create a decorator to check user roles:

```typescript
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Delete(':id')
deleteUser(@Param('id') id: string) {
  // Only admins can delete users
}
```

### 4. **Add Refresh Tokens**

- Access token expires quickly (15 minutes)
- Refresh token expires slowly (7 days)
- Use refresh token to get new access token

### 5. **Store Tokens in HttpOnly Cookies**

More secure than localStorage:

```typescript
res.cookie('access_token', token, { httpOnly: true });
```

### 6. **Add Password Reset Flow**

- Generate reset token
- Send email with reset link
- Verify token and update password

---

## 📝 File Structure Summary

```
src/
├── auth/
│   ├── dto/
│   │   ├── register.dto.ts          # Data for signup
│   │   ├── login.dto.ts              # Data for signin
│   │   └── auth-response.dto.ts     # Response with token
│   ├── guards/
│   │   └── jwt-auth.guard.ts        # Protect routes
│   ├── strategies/
│   │   └── jwt.strategy.ts          # How to validate JWT
│   ├── auth.controller.ts            # /auth endpoints
│   ├── auth.service.ts               # Auth business logic
│   └── auth.module.ts                # Wire everything together
├── users/
│   ├── users.controller.ts           # Protected with JwtAuthGuard
│   └── users.service.ts              # Now exports findByEmail()
└── app.module.ts                     # Imports AuthModule
```

---

## 🎉 Congratulations!

You've successfully implemented JWT authentication in NestJS! You now understand:

- ✅ How JWT tokens work
- ✅ Passport strategies and guards
- ✅ Password hashing with bcrypt
- ✅ Module dependencies and exports
- ✅ Route protection with guards
- ✅ Service-to-service injection

Keep learning and building! 🚀

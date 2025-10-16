# 🧪 API Testing Guide

## Quick Test Commands

### 1. Register (Signup) a New User
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

### 2. Login (Signin) with Existing User
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

### 3. Access Protected Route (Get All Users)
**Without Token (Should Fail):**
```bash
curl -X GET http://localhost:3000/users
```

**Expected Response:** `401 Unauthorized`

**With Token (Should Succeed):**
```bash
# First, save the token from login/register
TOKEN="your_jwt_token_here"

curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
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
  ...
]
```

### 4. Get Single User (Protected)
```bash
curl -X GET http://localhost:3000/users/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Test Validation Errors

### Invalid Email
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "not-an-email",
    "password": "secure123"
  }'
```

**Expected:** `400 Bad Request` with validation errors

### Password Too Short
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "password": "123"
  }'
```

**Expected:** `400 Bad Request` - "Password must be at least 6 characters"

---

## Complete Test Flow

### Step-by-Step Test:

1. **Register a new user:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob Smith","email":"bob@test.com","password":"password123"}' \
  | jq .
```

2. **Copy the access_token from the response**

3. **Try accessing protected route WITHOUT token:**
```bash
curl -X GET http://localhost:3000/users
# Should get 401 Unauthorized
```

4. **Access protected route WITH token:**
```bash
TOKEN="paste_your_token_here"
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN" \
  | jq .
```

5. **Login with the same user:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"bob@test.com","password":"password123"}' \
  | jq .
```

6. **Try registering with same email (should fail):**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob Again","email":"bob@test.com","password":"password123"}' \
  | jq .
# Should get 409 Conflict
```

---

## Using HTTPie (Alternative to curl)

If you have HTTPie installed (`brew install httpie`):

```bash
# Register
http POST localhost:3000/auth/register name="Alice" email="alice@test.com" password="secure123"

# Login
http POST localhost:3000/auth/login email="alice@test.com" password="secure123"

# Protected route
http GET localhost:3000/users "Authorization: Bearer YOUR_TOKEN"
```

---

## Testing with Postman/Insomnia

1. **Register Endpoint:**
   - Method: POST
   - URL: `http://localhost:3000/auth/register`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "name": "Alice Johnson",
       "email": "alice@example.com",
       "password": "secure123",
       "role": "user"
     }
     ```

2. **Login Endpoint:**
   - Method: POST
   - URL: `http://localhost:3000/auth/login`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "email": "alice@example.com",
       "password": "secure123"
     }
     ```

3. **Protected Endpoints:**
   - Method: GET
   - URL: `http://localhost:3000/users`
   - Headers: 
     - `Authorization: Bearer YOUR_JWT_TOKEN`

---

## Common Issues & Solutions

### ❌ 400 Bad Request
- **Cause:** Invalid data format or validation failed
- **Fix:** Check that all required fields are present and valid

### ❌ 401 Unauthorized
- **Cause:** Missing or invalid JWT token
- **Fix:** Include `Authorization: Bearer TOKEN` header

### ❌ 409 Conflict
- **Cause:** User with email already exists
- **Fix:** Use a different email or login instead

### ❌ 500 Internal Server Error
- **Cause:** Server-side error
- **Fix:** Check server logs for details

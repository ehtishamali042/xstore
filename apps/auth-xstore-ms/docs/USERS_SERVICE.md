# Users Service

## Overview

Manages user CRUD operations and user data storage.

**Location:** `src/users/users.service.ts`

## Core Responsibilities

1. User data management (in-memory storage)
2. User lookup by ID or email
3. User creation and deletion
4. Email notifications via EmailService

## User Entity

**Location:** `src/users/entities/user.entity.ts`

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Hashed by AuthService
  role: Role;
  createdAt: Date;
}
```

## Key Methods

### `findAll(): User[]`

Returns all users.

**Used by:**

- `GET /users` endpoint
- Admin user management

### `findOne(id: string): User`

Finds user by ID.

**Throws:** `NotFoundException` if user doesn't exist

**Used by:**

- `GET /users/:id` endpoint
- Token validation

### `findByEmail(email: string): User | undefined`

Finds user by email address.

**Returns:** User or `undefined` if not found

**Used by:**

- Registration (check if email exists)
- Login (find user for authentication)

### `create(createUserDto: CreateUserDto): User`

Creates new user.

**Process:**

1. Generate new user ID
2. Set default role to `USER` if not provided
3. Add user to in-memory storage
4. Send welcome email via EmailService
5. Return created user

**Note:** Password should already be hashed by AuthService

### `remove(id: string)`

Deletes user by ID.

**Process:**

1. Find user by ID
2. Remove from storage
3. Send account deletion email
4. Return deletion confirmation

**Throws:** `NotFoundException` if user doesn't exist

## Dependencies

```typescript
constructor(
  private loggerService: LoggerService,  // Logging
  private emailService: EmailService     // Email notifications
)
```

## Initial Data

Service includes 3 seed users for testing:

```typescript
{
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: Role.ADMIN
}
// + 2 more USER role accounts
```

## Storage

**Current:** In-memory array (data lost on restart)

**Future:** Replace with database:

- TypeORM for SQL
- Mongoose for MongoDB
- Prisma for any database

## Email Integration

Automatically sends emails on:

- User creation → Welcome email
- User deletion → Account deletion email

## Example Usage

```typescript
// Find user
const user = usersService.findByEmail('john@example.com');

// Create user
const newUser = usersService.create({
  name: 'Jane Doe',
  email: 'jane@example.com',
  password: 'hashed_password_here',
  role: Role.USER,
});

// Delete user
const result = usersService.remove('1');
```

## Error Handling

- `NotFoundException` - User not found (404)
- Logs all operations via LoggerService

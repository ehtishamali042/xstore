# Prisma Setup Guide for Products Microservice

## ✅ Setup Complete

Prisma has been successfully configured for the Products microservice with PostgreSQL.

## 📁 What Was Set Up

### 1. **Dependencies Installed**

- `@prisma/client` - Prisma Client for database operations
- `prisma` - Prisma CLI (dev dependency)

### 2. **Prisma Configuration**

- **Schema File**: `prisma/schema.prisma` with Product model
- **Config File**: `prisma.config.ts` with dotenv integration
- **Environment**: DATABASE_URL configured in `.env`

### 3. **Product Model Schema**

```prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  description String?
  price       Float
  stock       Int      @default(0)
  category    String?
  imageUrl    String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("products")
}
```

### 4. **NestJS Integration**

- **PrismaService**: `src/common/prisma/prisma.service.ts`
- **PrismaModule**: `src/common/prisma/prisma.module.ts` (Global module)
- **ProductsService**: Updated to use Prisma instead of in-memory array

## 🚀 Next Steps

### 1. **Set Up Your Database**

Make sure you have PostgreSQL running and update your DATABASE_URL in the root `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/products_db?schema=public"
```

### 2. **Run Migration**

Create and apply the initial migration to set up your database:

```bash
cd apps/products-xstore-ms
npx prisma migrate dev --name init
```

This will:

- Create the migration files
- Apply the migration to your database
- Create the `products` table

### 3. **Prisma Studio (Optional)**

View and manage your database data with Prisma Studio:

```bash
npx prisma studio
```

## 📝 Common Commands

```bash
# Generate Prisma Client (after schema changes)
npx prisma generate

# Create and apply a new migration
npx prisma migrate dev --name <migration-name>

# Apply migrations in production
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# View database in browser
npx prisma studio

# Format schema file
npx prisma format
```

## 🔧 Usage in Service

The ProductsService now uses Prisma for all CRUD operations:

```typescript
// Create
await this.prisma.product.create({ data: createProductDto });

// Find all
await this.prisma.product.findMany({ where: { isActive: true } });

// Find one
await this.prisma.product.findUnique({ where: { id } });

// Update
await this.prisma.product.update({ where: { id }, data: updateProductDto });

// Delete
await this.prisma.product.delete({ where: { id } });
```

## 📦 Features Maintained

- ✅ Redis caching (still active)
- ✅ JWT authentication guards
- ✅ Logging interceptors
- ✅ All CRUD endpoints working with database

## 🗄️ Database Connection

The PrismaService automatically:

- Connects on module initialization
- Disconnects on module destruction
- Logs all queries (in development)

## 🔐 Environment Variables

Required in your `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/products_db?schema=public"
```

## 📊 Migration Files

Migrations are stored in: `prisma/migrations/`

Each migration contains:

- `migration.sql` - SQL statements
- Timestamp in folder name for ordering

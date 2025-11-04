# XStore Microservices Quick Reference

## Services Overview

| Service  | Port | Purpose                | Database            | Auth          |
| -------- | ---- | ---------------------- | ------------------- | ------------- |
| Auth     | 3100 | Authentication & Users | PostgreSQL + Prisma | Generates JWT |
| Products | 3101 | Product Management     | PostgreSQL + Prisma | Uses JWT      |
| Orders   | 3102 | Order Management       | In-Memory JSON      | Uses JWT      |

## Getting JWT Token

### Register

```bash
curl -X POST http://localhost:3100/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!",
    "name": "John Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:3100/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'
```

Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## Using Services with JWT

### Products Service Examples

#### Get All Products

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3101/products
```

#### Create Product

```bash
curl -X POST http://localhost:3101/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Laptop",
    "description": "High-performance gaming laptop",
    "price": 1299.99,
    "stock": 50,
    "imageUrl": "https://example.com/laptop.jpg"
  }'
```

#### Update Product

```bash
curl -X PUT http://localhost:3101/products/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1199.99,
    "stock": 45
  }'
```

#### Delete Product

```bash
curl -X DELETE http://localhost:3101/products/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Orders Service Examples

#### Get All Orders

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3102/orders
```

#### Create Order

```bash
curl -X POST http://localhost:3102/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "productId": "prod-456",
    "quantity": 2,
    "totalPrice": 199.98,
    "shippingAddress": "123 Main St, City, Country"
  }'
```

#### Get Orders by User

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3102/orders?userId=user-123
```

#### Get Orders by Status

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3102/orders/status/pending
```

#### Update Order Status

```bash
curl -X PUT http://localhost:3102/orders/ORDER_ID/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shipped"
  }'
```

#### Delete Order

```bash
curl -X DELETE http://localhost:3102/orders/ORDER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Starting All Services

### Terminal 1 - Auth Service

```bash
cd apps/auth-xstore-ms
npm run start:dev
```

### Terminal 2 - Products Service

```bash
cd apps/products-xstore-ms
npm run start:dev
```

### Terminal 3 - Orders Service

```bash
cd apps/orders-xstore-ms
npm run start:dev
```

## Health Checks

```bash
# Auth Service
curl http://localhost:3100/

# Products Service
curl http://localhost:3101/

# Orders Service
curl http://localhost:3102/health
```

## Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Internal Server Error

## Environment Variables Required

Add to root `.env` file:

```env
# Auth Service
AUTH_PORT=3100
DATABASE_URL="postgresql://user:password@localhost:5432/auth_db?schema=public"

# Products Service
PRODUCTS_PORT=3101
DATABASE_URL="postgresql://user:password@localhost:5432/products_db?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379

# Orders Service
ORDERS_PORT=3102

# JWT Configuration (Shared)
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=1h
```

## Order Status Values

- `pending` - Order placed, awaiting confirmation
- `confirmed` - Order confirmed, preparing for shipment
- `shipped` - Order shipped
- `delivered` - Order delivered to customer
- `cancelled` - Order cancelled

## Tips

1. **Always include Authorization header** with Bearer token for Products and Orders services
2. **Auth service endpoints are public** (no token needed for login/register)
3. **Token expires** based on JWT_EXPIRES_IN setting (default 1h)
4. **Orders service data is temporary** - resets on restart
5. **Products service has caching** - may need time to reflect changes

## Troubleshooting

### "No authorization header found"

- Make sure to include: `-H "Authorization: Bearer YOUR_TOKEN"`

### "Invalid token"

- Token may be expired, get a new one by logging in
- Check JWT_SECRET is same across all services

### Service won't start

- Check if port is already in use
- Verify .env file exists and has correct values
- Run `npm install` in service directory

### Database connection issues (Auth/Products)

- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Run Prisma migrations: `npx prisma migrate dev`

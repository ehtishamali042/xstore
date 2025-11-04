# Orders Microservice - XStore

A NestJS microservice for managing orders in the XStore platform. This service uses an in-memory JSON array for data storage and implements JWT authentication using the shared `@xstore/auth-utils` package.

## Features

- 🛒 **Order Management**: Complete CRUD operations for orders
- 🔐 **JWT Authentication**: Secured endpoints using shared auth utilities
- 📦 **In-Memory Storage**: Simple JSON array-based data storage
- ✅ **Validation**: Request validation using class-validator
- 🚀 **NestJS Framework**: Built with modern TypeScript and NestJS

## Project Structure

```
orders-xstore-ms/
├── src/
│   ├── bootstrap/
│   │   └── load-env.ts          # Environment loading utility
│   ├── common/
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts # JWT authentication guard
│   │   ├── interceptors/        # Logging interceptors
│   │   └── logger/              # Logger service
│   ├── orders/
│   │   ├── dto/
│   │   │   ├── create-order.dto.ts
│   │   │   ├── update-order.dto.ts
│   │   │   └── order-response.dto.ts
│   │   ├── entities/
│   │   │   └── order.entity.ts
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   └── orders.module.ts
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts
├── test/                        # E2E tests
├── package.json
└── README.md
```

## Installation

### 1. Install Dependencies

```bash
cd apps/orders-xstore-ms
npm install
```

### 2. Environment Variables

Make sure you have a `.env` file in the root of the monorepo with the following variables:

```env
# Orders Service
ORDERS_PORT=3102

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=1h
```

## Running the Service

### Development Mode

```bash
npm run start:dev
```

The service will start on `http://localhost:3102`

### Production Mode

```bash
npm run build
npm run start:prod
```

## API Endpoints

All endpoints are protected by JWT authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Base Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint

### Orders Endpoints

#### Create Order

```http
POST /orders
Content-Type: application/json

{
  "userId": "user-123",
  "productId": "prod-456",
  "quantity": 2,
  "totalPrice": 199.98,
  "shippingAddress": "123 Main St, City, Country"
}
```

#### Get All Orders

```http
GET /orders
```

#### Get Orders by User ID

```http
GET /orders?userId=user-123
```

#### Get Order by ID

```http
GET /orders/:id
```

#### Get Orders by Status

```http
GET /orders/status/:status
```

Status values: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`

#### Update Order

```http
PUT /orders/:id
Content-Type: application/json

{
  "quantity": 3,
  "totalPrice": 299.97,
  "status": "confirmed"
}
```

#### Update Order Status

```http
PUT /orders/:id/status
Content-Type: application/json

{
  "status": "shipped"
}
```

#### Delete Order

```http
DELETE /orders/:id
```

## Order Model

```typescript
{
  id: string;                    // UUID
  userId: string;                // User who placed the order
  productId: string;             // Product being ordered
  quantity: number;              // Quantity ordered
  totalPrice: number;            // Total price
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress?: string;      // Optional shipping address
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last update timestamp
}
```

## Authentication

This service uses the shared `@xstore/auth-utils` package for JWT token validation. The `JwtAuthGuard` is applied globally to all endpoints, ensuring that only authenticated requests are processed.

To obtain a JWT token, use the authentication service (`auth-xstore-ms`) to login or register.

## Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Test Coverage

```bash
npm run test:cov
```

## Development Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in watch mode
- `npm run start:debug` - Start in debug mode
- `npm run build` - Build the application
- `npm run format` - Format code with Prettier
- `npm run lint` - Lint and fix code with ESLint

## Data Storage

This service uses an in-memory JSON array to store orders. This means:

- ✅ Simple and fast for development
- ✅ No database setup required
- ⚠️ Data is lost when the service restarts
- ⚠️ Not suitable for production use

For production, consider migrating to a persistent database solution like:

- PostgreSQL with Prisma (similar to products service)
- MongoDB
- MySQL

## Architecture

The service follows the NestJS modular architecture:

1. **Bootstrap Layer**: Environment loading and initialization
2. **Common Layer**: Shared utilities (guards, interceptors, logger)
3. **Orders Module**: Business logic for order management
4. **Application Layer**: Main app module and configuration

## Integration with Other Services

This service integrates with:

- **Auth Service** (`auth-xstore-ms`): For user authentication
- **Products Service** (`products-xstore-ms`): For product information (future integration)

## Next Steps

- Add integration with Products Service to validate product availability
- Implement order history and tracking
- Add payment processing integration
- Implement notification system for order updates
- Add pagination for list endpoints
- Implement order cancellation workflow
- Add order export functionality

## Support

For issues or questions, please refer to the main project documentation or create an issue in the repository.

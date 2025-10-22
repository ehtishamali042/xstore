# Products Microservice

A NestJS-based microservice for managing products with JWT authentication.

## Features

- ✅ CRUD operations for products (Create, Read, Update, Delete)
- ✅ In-memory product storage (demo array with 5 sample products)
- ✅ JWT authentication using `@xstore/auth-utils` package
- ✅ Global authentication guard (all endpoints protected)
- ✅ Input validation using class-validator
- ✅ CORS enabled
- ✅ RESTful API design

## Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
JWT_SECRET=your-secret-key-here
PORT=3001
```

### Running the Service

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

The service will start on `http://localhost:3001`

## API Endpoints

All endpoints require JWT authentication via the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

### Products Endpoints

| Method | Endpoint        | Description                |
| ------ | --------------- | -------------------------- |
| GET    | `/products`     | Get all products           |
| GET    | `/products/:id` | Get a single product by ID |
| POST   | `/products`     | Create a new product       |
| PUT    | `/products/:id` | Update a product           |
| DELETE | `/products/:id` | Delete a product           |

### Request Examples

#### Create Product

```bash
POST /products
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "stock": 100
}
```

#### Update Product

```bash
PUT /products/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Updated Product Name",
  "price": 89.99,
  "stock": 150
}
```

## Authentication

This service uses the `@xstore/auth-utils` package for JWT validation. All routes are protected by default using a global JWT guard.

To obtain a token, use the Auth Microservice at `http://localhost:3000/auth/login`.

## Sample Products

The service comes with 5 pre-loaded products:

1. Laptop - $1299.99
2. Wireless Mouse - $29.99
3. Mechanical Keyboard - $149.99
4. USB-C Hub - $49.99
5. Monitor Stand - $79.99

## Project Structure

```
src/
├── products/
│   ├── dto/
│   │   ├── create-product.dto.ts
│   │   ├── update-product.dto.ts
│   │   └── product-response.dto.ts
│   ├── entities/
│   │   └── product.entity.ts
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
├── common/
│   └── guards/
│       └── jwt-auth.guard.ts
├── app.module.ts
└── main.ts
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

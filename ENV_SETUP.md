# Environment Variables Setup

## Quick Start

1. **Copy the example file:**

   ```bash
   cp .env.example .env
   ```

2. **The `.env` file is already configured with default values** - you can start using it immediately!

## Environment Variables

### JWT Configuration

- **`JWT_SECRET`**: Shared secret key for JWT token signing and validation across all microservices
  - Default: `xstore-super-secret-jwt-key-2025-change-in-production`
  - ⚠️ **IMPORTANT**: Change this in production!

### Microservice Ports

- **`AUTH_PORT`**: Port for the Auth microservice (default: 3000)
- **`PRODUCTS_PORT`**: Port for the Products microservice (default: 3001)

### Database (Future Use)

Database configuration variables are commented out and ready for when you add database integration.

## How It Works

### Single `.env` File in Root

Both microservices read from the same `.env` file in the repository root:

```
xstore/
├── .env                    ← Single environment file
├── .env.example            ← Template file
├── apps/
│   ├── auth-xstore-ms/     ← Reads JWT_SECRET and AUTH_PORT
│   └── products-xstore-ms/ ← Reads JWT_SECRET and PRODUCTS_PORT
```

### Why This Works

- **Node.js Environment**: When you run a Node.js application, it automatically loads environment variables from the `.env` file in the current working directory
- **Shared Configuration**: Both services use the same `JWT_SECRET` ensuring tokens work across all microservices
- **Service-Specific Ports**: Each service has its own port variable

## Running the Services

### Auth Microservice

```bash
cd apps/auth-xstore-ms
npm run start:dev
# Runs on port 3000 (from AUTH_PORT)
```

### Products Microservice

```bash
cd apps/products-xstore-ms
npm run start:dev
# Runs on port 3001 (from PRODUCTS_PORT)
```

## Security Notes

✅ **`.env` is in `.gitignore`** - Your secrets won't be committed
✅ **`.env.example` is tracked** - Team members know what variables are needed
⚠️ **Change `JWT_SECRET` in production** - Never use the default in production!

## Production Deployment

For production, you should:

1. Set environment variables through your hosting platform (Heroku, AWS, Docker, etc.)
2. Use a strong, randomly generated JWT secret
3. Never commit the `.env` file to version control
4. Use different secrets for different environments (dev, staging, production)

## Troubleshooting

### Services can't validate tokens

- Make sure both services are using the same `JWT_SECRET`
- Restart both services after changing `.env`

### Port conflicts

- Change `AUTH_PORT` or `PRODUCTS_PORT` if another application is using those ports
- Make sure no other process is using ports 3000 or 3001

### Environment variables not loading

- Make sure you're running commands from the root directory where `.env` is located
- Try restarting the services

import { loadEnv } from "./bootstrap/load-env";
loadEnv();

import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
// Import AppModule after dotenv so ConfigModule can read env vars
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: true, // Allow all origins in development, configure properly in production
    credentials: true,
  });

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
    })
  );

  const port = process.env.ORDERS_PORT || 3102;
  await app.listen(port);
  console.log(`🚀 Orders Microservice is running on: http://localhost:${port}`);
  console.log(`📦 API Endpoints: http://localhost:${port}/orders`);
}

void bootstrap();

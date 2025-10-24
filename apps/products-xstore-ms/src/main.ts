import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from repository root
dotenv.config({ path: path.join(__dirname, '../../../.env') });

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
    }),
  );

  const port = process.env.PRODUCTS_PORT || 3101;
  await app.listen(port);
  console.log(
    `🚀 Products Microservice is running on: http://localhost:${port}`,
  );
  console.log(`📦 API Endpoints: http://localhost:${port}/products`);
}

void bootstrap();

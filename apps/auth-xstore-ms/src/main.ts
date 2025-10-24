import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from repository root
dotenv.config({ path: path.join(__dirname, '../../../.env') });

/**
 * 🚀 APPLICATION BOOTSTRAP
 *
 * 📚 Learning: ValidationPipe
 * - Automatically validates incoming requests against DTOs
 * - Transforms plain objects to DTO class instances
 * - Strips properties not defined in DTOs (whitelist)
 * - This is why our DTOs work without manual validation!
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication
  app.enableCors();

  // 🛡️ GLOBAL VALIDATION PIPE
  // This validates all incoming requests automatically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not in DTO
      forbidNonWhitelisted: false, // Don't throw error for extra properties
      transform: true, // Transform plain objects to DTO instances
    }),
  );

  await app.listen(process.env.AUTH_PORT || 3100);
  console.log(
    `🚀 Auth Microservice is running on: http://localhost:${process.env.AUTH_PORT || 3100}`,
  );
}

void bootstrap();

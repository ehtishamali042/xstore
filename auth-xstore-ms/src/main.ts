import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

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

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

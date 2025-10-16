import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

/**
 * 📚 Learning: DTO Validation with class-validator
 * - Decorators like @IsEmail, @IsString automatically validate incoming data
 * - ValidationPipe in main.ts applies these rules
 * - Invalid requests get rejected with 400 Bad Request
 */
export class RegisterDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsString()
  @IsOptional() // Optional field
  role?: string; // Optional, defaults to 'user'
}

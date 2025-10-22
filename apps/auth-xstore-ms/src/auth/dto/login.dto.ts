import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * DTO for user login with validation
 */
export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}

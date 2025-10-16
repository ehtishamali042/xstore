import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

// DTO = Data Transfer Object
// This defines what data is required to CREATE a user
export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string; // Required for creating users

  @IsString()
  @IsOptional()
  role?: string; // Optional field
}

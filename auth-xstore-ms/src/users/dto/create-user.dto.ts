import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

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

  @IsEnum(Role, {
    message: `role must be one of: ${Object.values(Role).join(', ')}`,
  })
  @IsOptional()
  role?: Role; // Optional field - defaults to 'user'
}

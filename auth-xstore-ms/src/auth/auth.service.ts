import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { User } from '../users/entities/user.entity';
import { Role } from './enums/role.enum';

/**
 * 🔐 AUTH SERVICE - The brain of authentication
 *
 * Key Concepts:
 * 1. Password Hashing: Never store plain passwords! Use bcrypt.
 * 2. JWT Tokens: Stateless authentication - server doesn't store sessions
 * 3. Validation: Check if user credentials are correct
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService, // Access user data
    private readonly jwtService: JwtService, // Generate JWT tokens
  ) {}

  /**
   * REGISTER - Create new user account
   * Steps:
   * 1. Check if user already exists
   * 2. Hash the password (NEVER store plain text!)
   * 3. Create user with hashed password
   * 4. Generate JWT token
   * 5. Return token + user info
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password with bcrypt (10 rounds of salting)
    // 🔒 Security: Hashing is one-way - can't reverse to get original password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user with hashed password
    const user = this.usersService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role || Role.USER, // Default to 'user' role
    });

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    // Return response WITHOUT password
    return {
      access_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * LOGIN - Authenticate existing user
   * Steps:
   * 1. Validate credentials
   * 2. Generate JWT token
   * 3. Return token + user info
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // Validate user credentials
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * VALIDATE USER - Check if credentials are correct
   * Used by Passport Local Strategy
   *
   * 🔍 How it works:
   * 1. Find user by email
   * 2. Compare provided password with hashed password using bcrypt
   * 3. Return user if valid, null if invalid
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    // Compare plain password with hashed password
    // bcrypt.compare() hashes the plain password and compares
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}

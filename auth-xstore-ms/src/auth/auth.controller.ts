import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

/**
 * 🎮 AUTH CONTROLLER - Handles authentication endpoints
 *
 * Key Concepts:
 * 1. Public Routes: These don't require authentication (anyone can signup/signin)
 * 2. HTTP Status Codes: 200 for login, 201 for registration
 * 3. DTO Validation: Automatic validation of incoming data
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/register
   * Create a new user account
   *
   * Example request body:
   * {
   *   "name": "John Doe",
   *   "email": "john@example.com",
   *   "password": "securePassword123",
   *   "role": "user"
   * }
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  /**
   * POST /auth/login
   * Authenticate an existing user
   *
   * @HttpCode(200) - Login should return 200, not 201 (REST convention)
   *
   * Example request body:
   * {
   *   "email": "john@example.com",
   *   "password": "securePassword123"
   * }
   */
  @Post('login')
  @HttpCode(HttpStatus.OK) // Login returns 200, not 201
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }
}

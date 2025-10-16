import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * 🔒 PROTECTED USERS CONTROLLER
 *
 * 📚 Learning: Guards and Route Protection
 * - @UseGuards(JwtAuthGuard) applied at controller level
 * - ALL routes in this controller now require JWT authentication
 * - Users MUST login first to access any endpoint here
 * - The authenticated user is available in req.user
 *
 * Alternative: Apply guard to individual routes
 * @UseGuards(JwtAuthGuard) on specific methods instead of controller
 */
@Controller('users')
@UseGuards(JwtAuthGuard) // 🛡️ Protect ALL routes in this controller
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users - Get all users (PROTECTED)
  // Can access authenticated user via @Request() req → req.user
  @Get()
  findAll(@Request() req: { user: User }): User[] {
    // req.user contains the authenticated user from JWT token
    console.log('Authenticated user:', req.user.email);
    return this.usersService.findAll();
  }

  // GET /users/groups - Get all user groups (PROTECTED)
  @Get('/groups')
  findAllUserGroups(): User[] {
    return this.usersService.findAll();
  }

  // GET /users/:id - Get one user by ID (PROTECTED)
  @Get(':id')
  findOne(@Param('id') id: string): User {
    return this.usersService.findOne(id);
  }

  // POST /users - Create a new user (PROTECTED)
  // Note: Normal user creation should go through /auth/register
  // This endpoint is for admin purposes
  @Post()
  @HttpCode(HttpStatus.CREATED) // Returns 201 status
  create(@Body() createUserDto: CreateUserDto): User {
    return this.usersService.create(createUserDto);
  }

  // DELETE /users/:id - Delete a user (PROTECTED)
  @Delete(':id')
  remove(@Param('id') id: string): { message: string; deletedUser: User } {
    return this.usersService.remove(id);
  }
}

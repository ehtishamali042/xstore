import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { User } from './entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

/**
 * 🔒 PROTECTED USERS CONTROLLER
 *
 * 📚 Learning: Global Guards
 * - BOTH JwtAuthGuard and RolesGuard are GLOBAL (registered in app.module.ts)
 * - ALL routes are automatically protected by JwtAuthGuard
 * - Use @Public() to mark routes as public (no auth required)
 * - Use @Roles() to add role-based access control
 */
@Controller('users')
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

  /**
   * 🔐 ADMIN ONLY ROUTE - Role-Based Access Control Example
   *
   * GET /users/admin/stats - Get admin statistics
   *
   * 📚 Learning: Global Guards (JwtAuthGuard + RolesGuard)
   * - BOTH guards are now GLOBAL (registered in app.module.ts)
   * - JwtAuthGuard automatically authenticates all routes
   * - RolesGuard automatically activates when @Roles() is present
   * - No need for @UseGuards() decorator!
   *
   * @Roles(Role.ADMIN)
   * - Specifies that only users with role='admin' can access
   * - Global RolesGuard reads this metadata automatically
   *
   * Flow:
   * 1. Global JwtAuthGuard validates token → attaches user to req
   * 2. Global RolesGuard sees @Roles() → checks if req.user.role === Role.ADMIN
   * 3. If admin → proceed to route handler
   * 4. If not admin → 403 Forbidden
   */
  @Get('admin/stats')
  @Roles(Role.ADMIN) // ← Only admins can access (both guards are global!)
  getAdminStats(@Request() req: { user: User }): {
    message: string;
    stats: {
      totalUsers: number;
      adminUsers: number;
      regularUsers: number;
      systemInfo: {
        requestedBy: string;
        requestedByRole: string;
        timestamp: Date;
      };
    };
  } {
    // Only accessible if user.role === 'admin'
    console.log(`🔐 Admin ${req.user.email} accessed admin stats`);

    const allUsers = this.usersService.findAll();
    const adminCount = allUsers.filter((u) => u.role === Role.ADMIN).length;
    const userCount = allUsers.filter((u) => u.role === Role.USER).length;

    return {
      message: '🎉 Admin-only statistics',
      stats: {
        totalUsers: allUsers.length,
        adminUsers: adminCount,
        regularUsers: userCount,
        systemInfo: {
          requestedBy: req.user.email,
          requestedByRole: req.user.role,
          timestamp: new Date(),
        },
      },
    };
  }
}

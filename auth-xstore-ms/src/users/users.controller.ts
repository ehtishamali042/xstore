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
 * - BOTH JwtAuthGuard and RolesGuard are now GLOBAL (registered in app.module.ts)
 * - ALL routes are automatically protected by JwtAuthGuard
 * - No need for @UseGuards() decorator anymore!
 * - Use @Public() to mark routes as public (no auth required)
 * - Use @Roles() to add role-based access control
 *
 * Guard Execution Flow:
 * 1. Global JwtAuthGuard → authenticates user, sets req.user
 * 2. Global RolesGuard → checks roles (if @Roles() present)
 * 3. Route Handler → your code executes
 *
 * How to protect routes:
 * - Authentication (default): No decorator needed - all routes protected
 * - Public route: @Public()
 * - Role-based: @Roles(Role.ADMIN)
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

  /**
   * 🔐 ADMIN OR NETSECOPS ROUTE - Multiple Roles Example
   *
   * GET /users/admin/activity - Get user activity logs
   *
   * @Roles(Role.ADMIN, Role.NETSECOPS)
   * - Accepts multiple roles (OR condition)
   * - User with EITHER 'admin' OR 'netsecops' role can access
   * - Global guards automatically enforce authentication and roles
   */
  @Get('admin/activity')
  @Roles(Role.ADMIN, Role.NETSECOPS) // ← Admin OR NetSecOps (both guards are global!)
  getUserActivity(@Request() req: { user: User }): {
    message: string;
    accessGrantedTo: string;
    recentActivity: string[];
  } {
    console.log(`🔐 ${req.user.role} ${req.user.email} accessed activity logs`);

    return {
      message: 'User activity logs (Admin/Moderator access)',
      accessGrantedTo: `${req.user.role} - ${req.user.email}`,
      recentActivity: [
        'User alice@example.com logged in',
        'User john@example.com updated profile',
        'Admin performed user deletion',
      ],
    };
  }
}

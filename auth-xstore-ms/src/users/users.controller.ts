import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users - Get all users
  @Get()
  findAll(): User[] {
    return this.usersService.findAll();
  }

  // GET /users/groups - Get all user groups
  @Get('/groups')
  findAllUserGroups(): User[] {
    return this.usersService.findAll();
  }

  // GET /users/:id - Get one user by ID
  @Get(':id')
  findOne(@Param('id') id: string): User {
    return this.usersService.findOne(id);
  }

  // POST /users - Create a new user
  @Post()
  @HttpCode(HttpStatus.CREATED) // Returns 201 status
  create(@Body() createUserDto: CreateUserDto): User {
    return this.usersService.create(createUserDto);
  }

  // DELETE /users/:id - Delete a user
  @Delete(':id')
  remove(@Param('id') id: string): { message: string; deletedUser: User } {
    return this.usersService.remove(id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoggerService } from '../common/logger/logger.service';
import { EmailService } from '../common/email/email.service';

@Injectable()
export class UsersService {
  // Inject BOTH services - Service-to-Service injection!
  constructor(
    private readonly logger: LoggerService,
    private readonly emailService: EmailService, // ← NEW: Inject EmailService
  ) {}

  private users: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      createdAt: new Date('2024-01-02'),
    },
    {
      id: '3',
      name: 'Bob Wilson',
      email: 'bob@example.com',
      role: 'user',
      createdAt: new Date('2024-01-03'),
    },
  ];

  // GET all users
  findAll(): User[] {
    this.logger.log(
      `Fetching all users. Total: ${this.users.length}`,
      'UsersService',
    );
    return this.users;
  }

  // GET one user by ID
  findOne(id: string): User {
    this.logger.log(`Fetching user with ID: ${id}`, 'UsersService');
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      this.logger.error(`User with ID ${id} not found`, '', 'UsersService');
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // CREATE a new user
  create(createUserDto: CreateUserDto): User {
    this.logger.log(
      `Creating new user: ${createUserDto.name} (${createUserDto.email})`,
      'UsersService',
    );
    const newUser: User = {
      id: String(this.users.length + 1),
      name: createUserDto.name,
      email: createUserDto.email,
      role: createUserDto.role || 'user',
      createdAt: new Date(),
    };
    this.users.push(newUser);
    this.logger.log(
      `User created successfully with ID: ${newUser.id}`,
      'UsersService',
    );

    // Use EmailService - Service-to-Service call!
    this.emailService.sendWelcomeEmail(newUser.email, newUser.name);

    return newUser;
  }

  // DELETE a user
  remove(id: string): { message: string; deletedUser: User } {
    this.logger.log(`Attempting to delete user with ID: ${id}`, 'UsersService');
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      this.logger.error(
        `Cannot delete: User with ID ${id} not found`,
        '',
        'UsersService',
      );
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const deletedUser = this.users[userIndex];
    this.users.splice(userIndex, 1);
    this.logger.log(
      `User ${deletedUser.name} (ID: ${id}) successfully deleted`,
      'UsersService',
    );

    // Use EmailService - Service-to-Service call!
    this.emailService.sendAccountDeletionEmail(
      deletedUser.email,
      deletedUser.name,
    );

    return {
      message: `User ${id} successfully deleted`,
      deletedUser,
    };
  }
}

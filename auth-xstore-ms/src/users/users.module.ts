import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { EmailModule } from '../common/email/email.module';

/**
 * 📚 Learning: Exporting Services
 * - Without 'exports', UsersService is ONLY available inside UsersModule
 * - With 'exports: [UsersService]', other modules can inject UsersService
 * - This is how AuthModule can access UsersService!
 */
@Module({
  imports: [EmailModule], // ← Import the MODULE (not the service!)
  controllers: [UsersController],
  providers: [UsersService], // ← UsersService only, EmailService comes from EmailModule
  exports: [UsersService], // ← Export so other modules (like AuthModule) can use it
})
export class UsersModule {}

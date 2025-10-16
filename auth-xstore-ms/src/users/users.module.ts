import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { EmailModule } from '../common/email/email.module';

@Module({
  imports: [EmailModule], // ← Import the MODULE (not the service!)
  controllers: [UsersController],
  providers: [UsersService], // ← UsersService only, EmailService comes from EmailModule
})
export class UsersModule {}

import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { EmailTemplateService } from './email-template.service';

@Injectable()
export class EmailService {
  // Inject multiple services from the SAME module!
  constructor(
    private readonly logger: LoggerService,
    private readonly templateService: EmailTemplateService, // ← Same module
  ) {}

  /**
   * Send a welcome email to new users
   */
  sendWelcomeEmail(email: string, name: string): void {
    this.logger.log(
      `Preparing to send welcome email to ${email}`,
      'EmailService',
    );

    // Use TemplateService (same module!)
    const htmlContent = this.templateService.getWelcomeTemplate(name);

    // Use QueueService (same module!)

    // In real app, this would integrate with SendGrid, AWS SES, etc.
    console.log(`📧 Sending welcome email to: ${email}`);
    console.log(`   Subject: Welcome ${name}!`);
    console.log(`   Body: ${htmlContent.substring(0, 50)}...`);

    this.logger.log(
      `Welcome email sent successfully to ${email}`,
      'EmailService',
    );
  }

  /**
   * Send account deletion confirmation
   */
  sendAccountDeletionEmail(email: string, name: string): void {
    this.logger.log(
      `Preparing to send deletion email to ${email}`,
      'EmailService',
    );

    console.log(`📧 Sending deletion confirmation to: ${email}`);
    console.log(`   Subject: Account Deleted - ${name}`);
    console.log(`   Body: Your account has been deleted successfully.`);

    this.logger.log(
      `Deletion email sent successfully to ${email}`,
      'EmailService',
    );
  }

  /**
   * Send generic notification
   */
  sendNotification(email: string, subject: string, message: string): void {
    this.logger.log(
      `Sending notification: "${subject}" to ${email}`,
      'EmailService',
    );

    console.log(`📧 Sending notification to: ${email}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Body: ${message}`);

    this.logger.log(
      `Notification sent successfully to ${email}`,
      'EmailService',
    );
  }
}

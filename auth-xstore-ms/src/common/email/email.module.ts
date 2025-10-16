import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailTemplateService } from './email-template.service';

// NOT @Global() - we'll import this explicitly where needed
@Module({
  providers: [
    EmailService, // ← Public service (exported)
    EmailTemplateService, // ← Internal service (NOT exported)
  ],
  exports: [EmailService], // ← Only export EmailService!
})
export class EmailModule {}
// ⚠️ Other modules can ONLY use EmailService
// ⚠️ They CANNOT use EmailTemplateService or EmailQueueService

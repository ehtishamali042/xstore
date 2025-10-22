import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailTemplateService {
  /**
   * Get email template
   */
  getWelcomeTemplate(name: string): string {
    return `
      <html>
        <body>
          <h1>Welcome ${name}!</h1>
          <p>Thanks for joining our platform.</p>
        </body>
      </html>
    `;
  }

  getDeletionTemplate(name: string): string {
    return `
      <html>
        <body>
          <h1>Goodbye ${name}</h1>
          <p>Your account has been deleted.</p>
        </body>
      </html>
    `;
  }
}

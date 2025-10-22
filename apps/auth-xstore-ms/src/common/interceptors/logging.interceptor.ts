import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

/**
 * 📊 HTTP LOGGING INTERCEPTOR
 *
 * 📚 Learning: What are Interceptors?
 * - Interceptors run BEFORE and AFTER every request
 * - They can transform the request/response
 * - Perfect for logging, caching, error handling
 * - Execute in a specific order based on binding
 *
 * This interceptor logs:
 * 1. Incoming Request: Method, URL, Body, Headers
 * 2. Outgoing Response: Status Code, Duration, Body
 * 3. Authentication info if present
 *
 * 🎯 Best Practice: Use interceptors for cross-cutting concerns
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Get HTTP request and response objects
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // Extract request details
    const { method, originalUrl, body, headers } = request;
    const userAgent = headers['user-agent'] || 'Unknown';
    const ip = request.ip || 'Unknown';
    const contentType = headers['content-type'] || 'Not specified';

    // Get authenticated user if available
    const user = (request as any).user;
    const userInfo = user ? `User: ${user.email} (${user.role})` : 'Anonymous';

    // Record start time
    const startTime = Date.now();

    // Check if body is empty
    const bodyContent =
      body && Object.keys(body).length > 0
        ? JSON.stringify(this.sanitizeBody(body))
        : 'No body / Empty body';

    // Log incoming request
    this.logger.log(
      `📥 INCOMING REQUEST\n` +
        `   Method: ${method}\n` +
        `   URL: ${originalUrl}\n` +
        `   ${userInfo}\n` +
        `   Content-Type: ${contentType}\n` +
        `   IP: ${ip}\n` +
        `   Body: ${bodyContent}`,
    );

    // Continue with request and log response
    return next.handle().pipe(
      tap({
        next: (data) => {
          // Calculate request duration
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          // Determine log level based on status code
          const isError = statusCode >= 400;
          const logMethod = isError ? 'error' : 'log';

          this.logger[logMethod](
            `📤 OUTGOING RESPONSE\n` +
              `   Method: ${method}\n` +
              `   URL: ${originalUrl}\n` +
              `   Status: ${statusCode}\n` +
              `   Duration: ${duration}ms\n` +
              `   Response: ${JSON.stringify(this.sanitizeResponse(data))}`,
          );
        },
        error: (error) => {
          // Log errors
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;

          this.logger.error(
            `❌ ERROR RESPONSE\n` +
              `   Method: ${method}\n` +
              `   URL: ${originalUrl}\n` +
              `   Status: ${statusCode}\n` +
              `   Duration: ${duration}ms\n` +
              `   Error: ${error.message}\n` +
              `   Stack: ${error.stack || 'No stack trace'}`,
          );
        },
      }),
    );
  }

  /**
   * Sanitize request body - remove sensitive fields
   * 🔒 Security: Never log passwords or tokens!
   */
  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sanitized = { ...body };

    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'secret', 'apiKey'];
    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });

    return sanitized;
  }

  /**
   * Sanitize response - remove sensitive fields
   */
  private sanitizeResponse(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    // If it's an array, sanitize each item
    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeResponseItem(item));
    }

    return this.sanitizeResponseItem(data);
  }

  /**
   * Sanitize individual response item
   */
  private sanitizeResponseItem(item: any): any {
    if (!item || typeof item !== 'object') {
      return item;
    }

    const sanitized = { ...item };

    // Remove password from user objects
    if (sanitized.password) {
      sanitized.password = '***REDACTED***';
    }

    // If user object exists, sanitize it
    if (sanitized.user && typeof sanitized.user === 'object') {
      sanitized.user = { ...sanitized.user };
      if (sanitized.user.password) {
        sanitized.user.password = '***REDACTED***';
      }
    }

    return sanitized;
  }
}

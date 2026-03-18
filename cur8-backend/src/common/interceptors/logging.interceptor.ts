import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`Success: ${method} ${url} - ${Date.now() - now}ms`);
      }),
      catchError((error) => {
        this.logger.error({
          stack: error.stack,
          message: error.message || 'Request Failed',
          details: { method, url, processingTimeMs: Date.now() - now },
          error,
        });
        return throwError(() => error);
      }),
    );
  }
}

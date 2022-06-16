import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { EntityNotFoundError } from 'typeorm';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<HttpException | EntityNotFoundError> {
    return next.handle().pipe<HttpException>(
      catchError((err) => {
        if (err instanceof EntityNotFoundError)
          throw new NotFoundException(err.message);
        else throw err;
      }),
    );
  }
}

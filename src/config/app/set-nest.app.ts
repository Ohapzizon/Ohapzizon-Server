import { INestApplication } from '@nestjs/common/interfaces/nest-application.interface';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
import { GlobalExceptionFilter } from '../../common/filters/global-exception.filter';
import { ValidationError } from 'class-validator';
import { CustomValidationError } from '../../common/filters/custom-validation.error';

export function setNestApp<T extends INestApplication>(app: T): void {
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(app.get(Logger), httpAdapter));
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
      validateCustomDecorators: true,
      validationError: {
        value: true,
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          validationErrors.map((e) => new CustomValidationError(e)),
        );
      },
    }),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludePrefixes: ['_'],
    }),
  );
}

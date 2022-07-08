import { Logger, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './global-exception.filter';

@Module({
  providers: [Logger, { provide: APP_FILTER, useClass: GlobalExceptionFilter }],
})
export class ExceptionModule {}

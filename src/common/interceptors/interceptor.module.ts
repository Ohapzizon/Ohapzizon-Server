import { Logger, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { NotFoundInterceptor } from './not-found.interceptor';

@Module({
  providers: [
    Logger,
    { provide: APP_INTERCEPTOR, useClass: NotFoundInterceptor },
  ],
})
export class InterceptorModule {}

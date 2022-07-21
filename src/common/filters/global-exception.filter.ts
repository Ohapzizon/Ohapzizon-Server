import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: Logger,
    private readonly httpAdapter: HttpAdapterHost,
  ) {}
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const { httpAdapter } = this.httpAdapter;

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
      this.logger.debug(exception.stack);
    }

    const httpStatus = (exception as HttpException).getStatus();
    const errorResponse = (exception as HttpException).getResponse();

    const log = {
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      method: httpAdapter.getRequestMethod(ctx.getRequest()),
      error: errorResponse,
    };
    this.logger.error(log);

    httpAdapter.reply(ctx.getResponse(), errorResponse, httpStatus);
  }
}

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: Logger,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}
  catch(exception: Error, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    if (!(exception instanceof HttpException)) {
      this.logger.error(exception.message, exception.name);
      exception = new InternalServerErrorException();
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const response = (exception as HttpException).getResponse();
    const responseBody = {
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      response,
    };
    this.logger.error(responseBody);
    httpAdapter.reply(ctx.getResponse(), responseBody);
  }
}

import {
  ArgumentsHost, BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  LoggerService,
  NotFoundException
} from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';
import { ResponseEntity } from '../response/response.entity';
import { instanceToPlain } from 'class-transformer';
import { ValidationError } from 'class-validator';
import { CustomValidationError } from './custom-validation.error';
import { ResponseStatus } from '../response/response.status';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly httpAdapter: AbstractHttpAdapter,
  ) {}
  async catch(exception: Error, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();

    if (!(exception instanceof HttpException)) {
      switch (exception.name) {
        case 'EntityNotFoundError':
          exception = new NotFoundException(
            '요청하신 자료를 찾을 수 없습니다.',
          );
          break;
        case 'DateTimeParseException':
          exception = new BadRequestException(exception.message);
          break;
        default:
          this.logger.debug(exception.stack);
          exception = new InternalServerErrorException('서버 에러 입니다.');
          break;
      }
    }

    const responseBody = (exception as HttpException).getResponse();
    const ResponseStatusValue =
      Object.keys(ResponseStatus)[
        Object.values(ResponseStatus).indexOf(
          responseBody['statusCode'] as ResponseStatus,
        )
      ];
    const isValidationError = responseBody instanceof ValidationError;

    const log = {
      timestamp: new Date().toISOString(),
      path: this.httpAdapter.getRequestUrl(ctx.getRequest()),
      method: this.httpAdapter.getRequestMethod(ctx.getRequest()),
      responseBody,
    };
    this.logger.error(log);

    await this.httpAdapter.reply(
      ctx.getResponse(),
      instanceToPlain(
        ResponseEntity.ERROR_WITH_DATA<CustomValidationError[]>(
          responseBody['message'] === undefined
            ? responseBody['error']
            : responseBody['message'],
          ResponseStatus[ResponseStatusValue],
          isValidationError
            ? [this.toCustomValidationErrorByNest(responseBody)]
            : responseBody['error'],
        ),
      ),
      responseBody['statusCode'],
    );
  }

  toCustomValidationErrorByNest(
    responseBody: ValidationError,
  ): CustomValidationError {
    return new CustomValidationError(responseBody);
  }
}

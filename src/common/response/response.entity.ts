import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseStatus } from './response.status';

export class ResponseEntity<T> {
  @ApiHideProperty() @Exclude() private readonly _statusCode: ResponseStatus;
  @ApiHideProperty() @Exclude() private readonly _message: string;
  @ApiHideProperty() @Exclude() private readonly _data: T;

  protected constructor(status: ResponseStatus, message: string, data: T) {
    this._statusCode = status;
    this._message = message;
    this._data = data;
  }

  static OK_WITH(message: string): ResponseEntity<string> {
    return new ResponseEntity<string>(ResponseStatus.OK, message, '');
  }

  static OK_WITH_DATA<T>(message: string, data: T): ResponseEntity<T> {
    return new ResponseEntity<T>(ResponseStatus.OK, message, data);
  }

  static CREATED_WITH_DATA<T>(message: string, data: T): ResponseEntity<T> {
    return new ResponseEntity<T>(ResponseStatus.CREATED, message, data);
  }

  static ERROR_WITH_DATA<T>(
    message: string,
    code: ResponseStatus = ResponseStatus.SERVER_ERROR,
    data: T,
  ): ResponseEntity<T> {
    return new ResponseEntity<T>(code, message, data);
  }

  @ApiProperty({
    type: 'number',
    description: 'HTTP Code입니다.',
  })
  @Expose()
  get statusCode(): ResponseStatus {
    return this._statusCode;
  }

  @ApiProperty({
    type: 'string',
    description: '응답 메시지입니다.',
  })
  @Expose()
  get message(): string {
    return this._message;
  }

  @ApiProperty({
    type: 'string',
    description: '응답 데이터입니다.',
  })
  @Expose()
  get data(): T {
    return this._data;
  }
}

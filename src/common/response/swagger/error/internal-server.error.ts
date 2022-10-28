import { ApiProperty } from '@nestjs/swagger';
import { ResponseStatus } from '../../response.status';
import { ResponseEntity } from '../../response.entity';

export class InternalServerError extends ResponseEntity<string> {
  @ApiProperty({
    description: 'Http Error Code입니다.',
    example: ResponseStatus.SERVER_ERROR,
  })
  get statusCode(): ResponseStatus {
    return super.statusCode;
  }

  @ApiProperty({
    example: '서버 에러입니다.',
  })
  get message(): string {
    return super.message;
  }

  @ApiProperty({
    example: 'Internal Server Error',
  })
  get data(): string {
    return super.data;
  }
}

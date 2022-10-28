import { ResponseEntity } from '../../response.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseStatus } from '../../response.status';

export class NotFoundError extends ResponseEntity<string> {
  @ApiProperty({
    description: 'Http Error Code입니다.',
    example: ResponseStatus.NOT_FOUND,
  })
  get statusCode(): ResponseStatus {
    return super.statusCode;
  }

  @ApiProperty({
    example: '요청하신 자료를 찾을 수 없습니다.',
  })
  get message(): string {
    return super.message;
  }

  @ApiProperty({
    example: 'Not Found',
  })
  get data(): string {
    return super.data;
  }
}

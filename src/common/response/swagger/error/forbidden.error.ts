import { ResponseEntity } from '../../response.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseStatus } from '../../response.status';

export class ForbiddenError extends ResponseEntity<string> {
  @ApiProperty({
    description: 'Http Error Code입니다.',
    example: ResponseStatus.FORBIDDEN,
  })
  get statusCode(): ResponseStatus {
    return super.statusCode;
  }

  @ApiProperty({
    example: '요청에 대한 액세스 권한이 없어 접근을 거부합니다.',
  })
  get message(): string {
    return super.message;
  }

  @ApiProperty({
    example: 'Forbidden',
  })
  get data(): string {
    return super.data;
  }
}

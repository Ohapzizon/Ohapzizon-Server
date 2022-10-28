import { ResponseEntity } from '../../response.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseStatus } from '../../response.status';

export class UnauthorizedError extends ResponseEntity<string> {
  @ApiProperty({
    description: 'Http Error Code입니다.',
    example: ResponseStatus.UNAUTHORIZED,
  })
  get statusCode(): ResponseStatus {
    return super.statusCode;
  }

  @ApiProperty({
    example: 'Unauthorized',
  })
  get message(): string {
    return super.message;
  }

  @ApiProperty({
    example: 'Unauthorized',
  })
  get data(): string {
    return super.data;
  }
}

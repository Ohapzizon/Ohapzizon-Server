import { ApiProperty } from '@nestjs/swagger';
import { UnauthorizedError } from './unauthorized.error';

export class InvalidTokenError extends UnauthorizedError {
  @ApiProperty({
    example: 'Invalid Token',
  })
  get message(): string {
    return super.message;
  }
}

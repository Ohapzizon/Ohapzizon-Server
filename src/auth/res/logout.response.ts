import { ApiProperty } from '@nestjs/swagger';
import { ResponseEntity } from '../../common/response/response.entity';
import { ResponseStatus } from '../../common/response/response.status';

export class LogoutResponse extends ResponseEntity<string> {
  @ApiProperty({
    example: ResponseStatus.OK,
  })
  get statusCode(): ResponseStatus {
    return super.statusCode;
  }

  @ApiProperty({
    example: '로그아웃에 성공하였습니다.',
  })
  get message(): string {
    return super.message;
  }

  @ApiProperty({
    example: '',
  })
  get data(): string {
    return super.data;
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { ResponseEntity } from '../../common/response/response.entity';
import { ResponseStatus } from '../../common/response/response.status';
import { LoginDto } from '../dto/login.dto';

export class LoginResponse extends ResponseEntity<LoginDto> {
  @ApiProperty({
    example: ResponseStatus.OK,
  })
  get statusCode(): ResponseStatus {
    return super.statusCode;
  }

  @ApiProperty({
    example: '로그인에 성공하였습니다.',
  })
  get message(): string {
    return super.message;
  }

  @ApiProperty({
    type: LoginDto,
  })
  get data(): LoginDto {
    return super.data;
  }
}

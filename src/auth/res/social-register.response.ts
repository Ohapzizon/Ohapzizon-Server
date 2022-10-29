import { ApiProperty } from '@nestjs/swagger';
import { ResponseStatus } from '../../common/response/response.status';
import { ResponseEntity } from '../../common/response/response.entity';
import { LoginDto } from '../dto/login.dto';

export class SocialRegisterResponse extends ResponseEntity<LoginDto> {
  @ApiProperty({
    example: ResponseStatus.CREATED,
  })
  get statusCode(): ResponseStatus {
    return super.statusCode;
  }

  @ApiProperty({
    example: '소셜 계정 등록에 성공하였습니다.',
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

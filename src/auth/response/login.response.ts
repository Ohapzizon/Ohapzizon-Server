import { ApiProperty } from '@nestjs/swagger';
import BaseResponse from 'src/common/response/base.response';
import { LoginDto } from '../dto/login.dto';

export class LoginResponse extends BaseResponse<LoginDto> {
  @ApiProperty({
    type: () => LoginDto,
  })
  data!: LoginDto;
}

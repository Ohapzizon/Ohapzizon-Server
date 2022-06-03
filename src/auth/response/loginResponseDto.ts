import { ApiProperty } from '@nestjs/swagger';
import BaseResponse from 'src/common/response/base.response';
import { Exclude } from 'class-transformer';
import { ShowUserDto } from '../../user/dto/show-user.dto';

export default class LoginResponseData {
  @Exclude() private readonly username: string;
  @Exclude() private readonly accessToken: string;
  @Exclude() private readonly refreshToken: string;

  constructor(user: ShowUserDto, tokens: Map<string, string>) {
    this.username = user.name;
    this.accessToken = tokens.get('accessToken');
    this.refreshToken = tokens.get('refreshToken');
  }
}

export class LoginResponseDto extends BaseResponse<LoginResponseData> {
  @ApiProperty({
    type: () => LoginResponseData,
  })
  data!: LoginResponseData;
}

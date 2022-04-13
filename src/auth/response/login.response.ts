import { ApiProperty } from '@nestjs/swagger';
import BaseResponse from 'src/common/response/base.response';
import User from '../../entities/user.entity';
import { Exclude } from 'class-transformer';

export default class LoginResponseData {
  @Exclude() private readonly username: string;
  @Exclude() private readonly accessToken: string;
  @Exclude() private readonly refreshToken: string;

  constructor(user: User, accessToken: string, refreshToken: string) {
    this.username = user.name;
    this.accessToken = 'Bearer ' + accessToken;
    this.refreshToken = 'Bearer ' + refreshToken;
  }
}

export class LoginResponse extends BaseResponse<LoginResponseData> {
  @ApiProperty({
    type: () => LoginResponseData,
  })
  data!: LoginResponseData;
}

import { ApiProperty } from '@nestjs/swagger';
import BaseResponse from 'src/common/response/base.response';
import User from '../../entities/user.entity';

export default class LoginResponseData {
  public user: User;
  public accessToken: string;
  public refreshToken: string;

  constructor(user: User, accessToken: string, refreshToken: string) {
    this.user = user;
    this.accessToken = 'Bearer ' + accessToken;
    this.refreshToken = 'Bearer ' + refreshToken;
  }
}

export class LoginResponse extends BaseResponse<LoginResponseData> {
  @ApiProperty({
    type: () => LoginResponseData,
  })
  data: LoginResponseData;
}

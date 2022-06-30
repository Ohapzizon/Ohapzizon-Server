import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @Expose() private readonly _username: string;
  @Expose() private readonly _accessToken: string;
  @Exclude() private readonly _refreshToken: string;

  constructor(map: Map<string, string>) {
    this._username = map.get('username');
    this._accessToken = map.get('accessToken');
    this._refreshToken = map.get('refreshToken');
  }

  @ApiProperty()
  @Expose()
  get username(): string {
    return this._username;
  }

  @ApiProperty()
  @Expose()
  get accessToken(): string {
    return this._accessToken;
  }

  @ApiProperty()
  @Expose()
  get refreshToken(): string {
    return this._refreshToken;
  }
}

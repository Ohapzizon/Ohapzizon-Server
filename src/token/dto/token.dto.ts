import { Exclude, Expose } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiHideProperty() @Exclude() private readonly _accessToken: string;
  @ApiHideProperty() @Exclude() private readonly _refreshToken?: string;

  constructor(accessToken: string, refreshToken?: string) {
    this._accessToken = accessToken;
    this._refreshToken = refreshToken;
  }

  @ApiProperty({
    name: 'accessToken',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiVVNFUiIsImlhdCI6MTY2NTg5MTkzNSwiZXhwIjoxNzUyMjkxOTM1LCJpc3MiOiJvaGFweml6b24iLCJzdWIiOiJhY2Nlc3NfdG9rZW4ifQ.wyRCN4rdIKs6rG4jL1XnPG_azx2W0Ed2SvpRlW4Rlu8',
  })
  @Expose()
  get accessToken(): string {
    return this._accessToken;
  }

  @ApiProperty({
    name: 'refreshToken',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiVVNFUiIsImlhdCI6MTY2NTg5MTkzNSwiZXhwIjoxNzUyMjkxOTM1LCJpc3MiOiJvaGFweml6b24iLCJzdWIiOiJhY2Nlc3NfdG9rZW4ifQ.wyRCN4rdIKs6rG4jL1XnPG_azx2W0Ed2SvpRlW4Rlu8',
  })
  @Expose()
  get refreshToken(): string | null {
    return this._refreshToken;
  }
}

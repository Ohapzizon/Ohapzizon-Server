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
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNzg3YzlhMi1kNjM1LTRhZGQtYjlmZi02OWYwMzk4MGU4ZmQiLCJuYW1lIjoi7Iah7Jyg7ZiEIiwibmlja25hbWUiOiLshqHsnKDtmIQiLCJlbWFpbCI6ImRvb25nMzM3M0BnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTY2ODAwNDc3NywiZXhwIjoxNjY4MDA2NTc3LCJpc3MiOiJvaGFweml6b24uY29tIn0.JjQ_UfgR06gFL4EFFXZY0EGSZsqF8bMQvZoBDGaU_wU',
  })
  @Expose()
  get accessToken(): string {
    return this._accessToken;
  }

  @ApiProperty({
    name: 'refreshToken',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MzNlMjVmOC0zYjZiLTQ1ZmUtYjBiYS02YTFlMDJmMzVhOWYiLCJpYXQiOjE2NjgwMDQ3NzcsImV4cCI6MTY3MDU5Njc3NywiaXNzIjoib2hhcHppem9uIn0.LN9_ZH3gm2MDI0S1KISW85AjsQo8fCSfEKV1_ETTJAc',
  })
  @Expose()
  get refreshToken(): string | null {
    return this._refreshToken;
  }
}

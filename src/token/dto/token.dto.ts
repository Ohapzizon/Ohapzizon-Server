import { IsString } from 'class-validator';

export class TokenDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly accessToken: string;

  @IsString()
  readonly refreshToken?: string;
}

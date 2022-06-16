import { Exclude, Expose } from 'class-transformer';

export class LoginDto {
  @Expose() private readonly username: string;
  @Expose() private readonly accessToken: string;
  @Exclude() private readonly refreshToken: string;

  constructor(username: string, tokens: Map<string, string>) {
    this.username = username;
    this.accessToken = tokens.get('accessToken');
    this.refreshToken = tokens.get('refreshToken');
  }
}

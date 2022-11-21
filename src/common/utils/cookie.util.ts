import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenDto } from '../../token/dto/token.dto';

export class CookieUtil {
  private readonly ACCESS_TOKEN_EXPIRATION: number;
  private readonly REFRESH_TOKEN_EXPIRATION: number;
  private readonly REGISTER_TOKEN_EXPIRATION: number;

  constructor(private readonly configService: ConfigService) {
    this.ACCESS_TOKEN_EXPIRATION = this.configService.get<number>(
      'ACCESS_TOKEN_EXPIRATION',
    );
    this.REFRESH_TOKEN_EXPIRATION = this.configService.get<number>(
      'REFRESH_TOKEN_EXPIRATION',
    );
  }

  setUserTokenCookie(res: Response, tokenDto: TokenDto): void {
    res.cookie('accessToken', tokenDto.accessToken, {
      maxAge: this.ACCESS_TOKEN_EXPIRATION,
      httpOnly: true,
    });
    res.cookie('refreshToken', tokenDto.refreshToken, {
      maxAge: this.REFRESH_TOKEN_EXPIRATION,
      httpOnly: true,
    });
  }

  setRegisterTokenCookie(res: Response, registerToken: string): void {
    res.cookie('registerToken', registerToken, {
      maxAge: this.REGISTER_TOKEN_EXPIRATION,
      httpOnly: true,
      domain: 'https://ohapzizon.com',
    });
  }

  resetTokenCookie(res: Response): void {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }
}

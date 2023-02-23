import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenDto } from '../../token/dto/token.dto';
import { Injectable } from '@nestjs/common';
import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_EXPIRATION_TIME,
  REGISTER_TOKEN_EXPIRATION_TIME,
} from '../constants';

@Injectable()
export class CookieUtil {
  private readonly ACCESS_TOKEN_EXPIRATION_TIME: number;
  private readonly REFRESH_TOKEN_EXPIRATION_TIME: number;
  private readonly REGISTER_TOKEN_EXPIRATION_TIME: number;

  constructor(private readonly configService: ConfigService) {
    this.ACCESS_TOKEN_EXPIRATION_TIME = +this.configService.get<number>(
      ACCESS_TOKEN_EXPIRATION_TIME,
    );
    this.REFRESH_TOKEN_EXPIRATION_TIME = +this.configService.get<number>(
      REFRESH_TOKEN_EXPIRATION_TIME,
    );
    this.REGISTER_TOKEN_EXPIRATION_TIME = +this.configService.get<number>(
      REGISTER_TOKEN_EXPIRATION_TIME,
    );
  }

  setUserTokenCookie(res: Response, tokenDto: TokenDto): void {
    res.cookie('accessToken', tokenDto.accessToken, {
      maxAge: this.ACCESS_TOKEN_EXPIRATION_TIME,
      httpOnly: true,
    });
    res.cookie('refreshToken', tokenDto.refreshToken, {
      maxAge: this.REFRESH_TOKEN_EXPIRATION_TIME,
      httpOnly: true,
    });
  }

  setRegisterTokenCookie(res: Response, registerToken: string): void {
    res.cookie('registerToken', registerToken, {
      maxAge: this.REGISTER_TOKEN_EXPIRATION_TIME,
      httpOnly: true,
    });
  }

  resetTokenCookie(res: Response): void {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }
}

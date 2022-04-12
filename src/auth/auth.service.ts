import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { GoogleCodeDto } from './dto/google-code.dto';
import axios, { AxiosResponse } from 'axios';
import { IGoogleUser } from '../common/types/google-user.types';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '../token/token.service';
import LoginResponseDto from './response/login.response';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import User from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  private clientID: string = this.configService.get<string>('CLIENT_ID');
  private clientSecret: string =
    this.configService.get<string>('CLIENT_SECRET');
  private callbackURL: string = this.configService.get<string>('CALLBACK_URL');

  async logIn(googleCodeDto: GoogleCodeDto): Promise<LoginResponseDto> {
    const { id, email, name } = await this.getGoogleUserInfo(googleCodeDto);
    const user: User = await this.userService.register(id, email, name);
    const accessToken = this.tokenService.createAccessToken(id, email, name);
    const refreshToken = await this.tokenService.createRefreshToken(id);
    return new LoginResponseDto(user, accessToken, refreshToken);
  }

  logOut(userId: string): Promise<void> {
    return this.tokenService.removeRefreshToken(userId);
  }

  getOAuthRedirectURL(res: Response): void {
    const hostName = 'https://accounts.google.com';
    const scope = 'email profile';
    res.redirect(
      `${hostName}/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&redirect_uri=${this.callbackURL}&scope=${scope}&client_id=${this.clientID}`,
    );
  }

  async getGoogleUserInfo(googleCodeDto: GoogleCodeDto): Promise<IGoogleUser> {
    const { code } = googleCodeDto;
    const getTokenUrl = `https://oauth2.googleapis.com/token?code=${code}&client_id=${this.clientID}&client_secret=${this.clientSecret}&redirect_uri=${this.callbackURL}&grant_type=authorization_code`;
    try {
      const response: AxiosResponse = await axios.post(getTokenUrl);
      const { access_token } = response.data;
      const { data } = await axios.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      return data;
    } catch (e) {
      Logger.error(e);
      throw new UnauthorizedException('구글 인증에 실패했습니다.');
    }
  }
}

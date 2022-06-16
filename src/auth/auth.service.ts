import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { GoogleCodeDto } from './dto/google-code.dto';
import axios, { AxiosResponse } from 'axios';
import { IGoogleUser } from './types/google-user.types';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '../token/token.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import User from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  private readonly clientID: string =
    this.configService.get<string>('CLIENT_ID');
  private readonly clientSecret: string =
    this.configService.get<string>('CLIENT_SECRET');
  private readonly callbackURL: string =
    this.configService.get<string>('CALLBACK_URL');

  async logIn(googleCodeDto: GoogleCodeDto): Promise<LoginDto> {
    const data: IGoogleUser = await this.getGoogleUserInfo(googleCodeDto);
    const user: User = await this.userService.register({
      userId: data.id,
      email: data.email,
      name: data.name,
    });
    const tokens: Map<string, string> = await this.tokenService.createTokens(
      user,
    );
    return new LoginDto(user.name, tokens);
  }

  logOut(currentUserId: string): Promise<void> {
    return this.tokenService.removeRefreshToken(currentUserId);
  }

  getOAuthRedirectURL(res: Response): void {
    const hostName = 'https://accounts.google.com';
    const responseType = 'code';
    const scope = 'email profile';
    res.redirect(
      `${hostName}/o/oauth2/v2/auth/oauthchooseaccount?response_type=${responseType}&redirect_uri=${this.callbackURL}&scope=${scope}&client_id=${this.clientID}`,
    );
  }

  private async getGoogleUserInfo(
    googleCodeDto: GoogleCodeDto,
  ): Promise<IGoogleUser> {
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
      this.logger.error(e);
      throw new UnauthorizedException('구글 인증에 실패했습니다.');
    }
  }
}

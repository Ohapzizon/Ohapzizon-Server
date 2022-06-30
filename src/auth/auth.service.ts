import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { GoogleCodeDto } from './dto/google-code.dto';
import axios, { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '../token/token.service';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import User from '../entities/user.entity';
import { GoogleUserInfo } from './types/google-user.types';

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

  getGoogleRedirectURL() {
    const hostName = 'https://accounts.google.com';
    const responseType = 'code';
    const scope = 'email profile';
    return {
      url: `${hostName}/o/oauth2/v2/auth/oauthchooseaccount?response_type=${responseType}&redirect_uri=${this.callbackURL}&scope=${scope}&client_id=${this.clientID}`,
      statusCode: 302,
    };
  }

  async googleLogIn(googleCodeDto: GoogleCodeDto): Promise<LoginDto> {
    try {
      const googleUserInfo: GoogleUserInfo = await this.getGoogleUserInfo(
        googleCodeDto,
      );
      const registeredUser: User = await this.userService.register({
        googleId: googleUserInfo.id,
        email: googleUserInfo.email,
        name: googleUserInfo.name,
      });
      const map: Map<string, string> = await this.tokenService.createTokens(
        registeredUser,
      );
      return new LoginDto(map);
    } catch (e) {
      this.logger.error(e);
      throw new UnauthorizedException('회원가입에 실패하였습니다.');
    }
  }

  logOut(userId: number): Promise<void> {
    return this.tokenService.removeRefreshToken(userId);
  }

  private async getGoogleUserInfo(
    googleCodeDto: GoogleCodeDto,
  ): Promise<GoogleUserInfo> {
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

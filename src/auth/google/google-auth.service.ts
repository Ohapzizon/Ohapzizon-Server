import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleUserInfo } from './types/google-user.types';
import { SocialProfile } from '../types/social-profile';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AuthService } from '../auth.service';
import User from '../../entities/user.entity';

@Injectable()
export class GoogleAuthService {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.GOOGLE_CLIENT_ID = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.GOOGLE_CLIENT_SECRET = this.configService.get<string>(
      'GOOGLE_CLIENT_SECRET',
    );
    this.CALLBACK_URL = this.configService.get<string>('CALLBACK_URL');
  }

  private readonly GOOGLE_CLIENT_ID: string;
  private readonly GOOGLE_CLIENT_SECRET: string;
  private readonly CALLBACK_URL: string;

  getGoogleRedirectURL() {
    const uri =
      'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount';
    const responseType = 'code';
    const scope = 'email profile';
    return {
      url: `${uri}?response_type=${responseType}&redirect_uri=${this.CALLBACK_URL}&scope=${scope}&client_id=${this.GOOGLE_CLIENT_ID}`,
      status: 301,
    };
  }

  async googleLogin(code: string): Promise<User | string> {
    const accessToken: string = await this.getGoogleAccessToken(code);
    const profile: SocialProfile = await this.getGoogleProfile(accessToken);
    return this.authService.socialLogin(accessToken, profile, 'google');
  }

  private async getGoogleAccessToken(code: string): Promise<string> {
    const getTokenUrl = `https://oauth2.googleapis.com/token?code=${code}&client_id=${this.GOOGLE_CLIENT_ID}&client_secret=${this.GOOGLE_CLIENT_SECRET}&redirect_uri=${this.CALLBACK_URL}&grant_type=authorization_code`;
    const { data } = await this.httpService.axiosRef.post(getTokenUrl);
    const accessToken = data.access_token;
    if (!accessToken)
      throw new InternalServerErrorException(
        'Failed to retrieve google access token',
      );
    return accessToken;
  }

  private async getGoogleProfile(accessToken: string): Promise<SocialProfile> {
    const getUserInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
    const { data } = await this.httpService.axiosRef.get<GoogleUserInfo>(
      getUserInfoUrl,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const profile: SocialProfile = {
      socialId: data.id,
      name: data.name,
      email: data.email,
      thumbnail: data.picture,
    };
    if (!profile)
      throw new InternalServerErrorException(
        'Failed to retrieve google user info',
      );
    return profile;
  }
}

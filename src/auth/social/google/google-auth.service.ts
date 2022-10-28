import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { GoogleUserInfo } from './types/google-user.types';
import { SocialProfile } from '../types/social-profile';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '../../../token/token.service';
import { UserService } from '../../../user/user.service';
import SocialAccount from '../../../entities/social-account.entity';
import { LoginDto } from '../../dto/login.dto';
import { TokenDto } from '../../../token/dto/token.dto';
import { socialAccountRepository } from '../social-account.repository';
import { Response } from 'express';
import axios from 'axios';
import dataSource from '../../../config/database/data-source';
import { LocalDateTime } from '@js-joda/core';

@Injectable()
export class GoogleAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  private readonly googleClientID =
    this.configService.get<string>('GOOGLE_CLIENT_ID');
  private readonly googleClientSecret = this.configService.get<string>(
    'GOOGLE_CLIENT_SECRET',
  );
  private readonly callbackURL = this.configService.get<string>('CALLBACK_URL');

  getGoogleRedirectURL() {
    const uri =
      'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount';
    const responseType = 'code';
    const scope = 'email profile';
    return {
      url: `${uri}?response_type=${responseType}&redirect_uri=${this.callbackURL}&scope=${scope}&client_id=${this.googleClientID}`,
      status: 301,
    };
  }

  async googleLogIn(
    code: string,
    res: Response,
  ): Promise<LoginDto | { registerToken: string }> {
    const accessToken: string = await this.getGoogleAccessToken(code);
    const profile: SocialProfile = await this.getGoogleProfile(accessToken);
    Logger.log(LocalDateTime.now().get);
    const existSocialAccount: boolean =
      await socialAccountRepository.isExistBySocialId(profile.id, 'google');
    if (existSocialAccount) {
      const socialAccount: SocialAccount =
        await socialAccountRepository.findOneBySocialIdOrFail(profile.id);
      const tokenDto: TokenDto = await this.tokenService.generateUserToken(
        socialAccount.user,
        socialAccount.user.profile,
        dataSource.manager,
      );
      this.tokenService.setTokenCookie(
        res,
        tokenDto.accessToken,
        tokenDto.refreshToken,
      );
      return new LoginDto(socialAccount.user.profile, tokenDto);
    }
    const registerToken = this.tokenService.generateRegisterToken({
      profile: profile,
      accessToken: accessToken,
      provider: 'google',
    });
    res.cookie('registerToken', registerToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    return { registerToken };
  }

  private async getGoogleAccessToken(code: string): Promise<string> {
    const getTokenUrl = `https://oauth2.googleapis.com/token?code=${code}&client_id=${this.googleClientID}&client_secret=${this.googleClientSecret}&redirect_uri=${this.callbackURL}&grant_type=authorization_code`;
    const { data } = await axios.post(getTokenUrl);
    const accessToken = data.access_token;
    if (!accessToken)
      throw new InternalServerErrorException(
        'Failed to retrieve google access token',
      );
    return accessToken;
  }

  private async getGoogleProfile(accessToken: string): Promise<SocialProfile> {
    const getUserInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
    const { data } = await axios.get<GoogleUserInfo>(getUserInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const profile: SocialProfile = {
      id: data.id,
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

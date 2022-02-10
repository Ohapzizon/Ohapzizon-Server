import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import User from '../entities/user.entity';
import { GoogleCodeDto } from './dto/google-code.dto';
import axios, { AxiosResponse } from 'axios';
import { IGoogleUser } from '../common/interfaces/google-user.interface';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '../token/token.service';
import LoginResponseDto from './dto/login-response.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  private clientID: string = this.configService.get<string>('CLIENT_ID');
  private clientSecret: string =
    this.configService.get<string>('CLIENT_SECRET');
  private callbackURL: string = this.configService.get<string>('CALLBACK_URL');

  async logIn(googleCodeDto: GoogleCodeDto): Promise<LoginResponseDto> {
    const { email, name } = await this.getGoogleUserInfo(googleCodeDto);
    const accessToken: string = this.tokenService.createAccessToken(
      email,
      name,
    );
    const refreshToken: string = await this.tokenService.createRefreshToken(
      name,
    );
    const user: User = await this.userRepository.findUser({
      where: { email: email },
    });
    return new LoginResponseDto(user, accessToken, refreshToken);
  }

  async logOut(id: string): Promise<void> {
    await this.tokenService.removeRefreshToken(id);
  }

  getOAuthRedirectURL(res: Response): void {
    const hostName = 'https://accounts.google.com';
    const scope = 'email profile';
    res.redirect(
      `${hostName}/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&redirect_uri=${this.callbackURL}&scope=${scope}&client_id=${this.clientID}`,
    );
  }

  async getGoogleUserInfo(googleCodeDto: GoogleCodeDto) {
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
      const { id, email, name }: IGoogleUser = data;
      const user: User | undefined = await this.userRepository.findOne({
        user_id: id,
      });
      if (!user) {
        await this.userRepository.upsert(
          { user_id: id, email: email, name: name },
          ['user_id'],
        );
      }
      return user;
    } catch (e) {
      Logger.error(e);
      throw new UnauthorizedException('구글 인증에 실패했습니다.');
    }
  }
}

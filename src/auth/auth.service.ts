import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import User from '../entities/user.entity';
import { GoogleCodeDto } from './dto/google-code.dto';
import axios, { AxiosResponse } from 'axios';
import { IGoogleUser } from '../common/interfaces/google-user.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async logout(idx: string): Promise<void> {
    const user: User = await this.userRepository.findUser({
      where: idx,
    });
    await user.removeRefreshToken();
  }

  async getGoogleUserInfo(googleCodeDto: GoogleCodeDto) {
    const { code } = googleCodeDto;
    const clientID = this.configService.get<string>('CLIENT_ID');
    const clientSecret = this.configService.get<string>('CLIENT_SECRET');
    const redirectURI = this.configService.get('CALLBACK_URL');
    const getTokenUrl = `https://oauth2.googleapis.com/token?code=${code}&client_id=${clientID}&client_secret=${clientSecret}&redirect_uri=${redirectURI}&grant_type=authorization_code`;
    let response: AxiosResponse = null;
    try {
      response = await axios.post(getTokenUrl);
    } catch (e) {
      throw new UnauthorizedException('구글 인증에 실패했습니다.');
    }
    const { access_token } = response.data;
    const getUserUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
    const { data } = await axios.get(getUserUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const { id, email, name }: IGoogleUser = data;
    let user: User | undefined = await this.userRepository.findOne({
      user_idx: id,
    });
    if (!user) {
      user = this.userRepository.create({
        user_idx: id,
        email: email,
        name: name,
      });
      await this.userRepository.save(user);
    }
    return user;
  }
}

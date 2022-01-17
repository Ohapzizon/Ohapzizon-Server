import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GoogleCodeDto } from '../auth/dto/google-code.dto';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { IGoogleUser } from '../common/interfaces/google-user.interface';
import User from '../entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {}
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
    // const info: User = {
    //   user_idx: ,
    //   name: ,
    //   email: ,
    // }
    // return info;
  }
}

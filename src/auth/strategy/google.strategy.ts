import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import User from '../../entities/user.entity';
import { UserRepository } from '../../user/user.repository';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      clientID: configService.get<string>('CLIENT_ID'),
      clientSecret: configService.get<string>('CLIENT_SECRET'),
      callbackURL: configService.get<string>('CALLBACK_URL'),
      scope: ['email', 'profile'], // email을 통해 Google한테 받아올 사용자 정보
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<User> {
    const { id, emails, displayName } = profile;
    let user: User = await this.userRepository.findOne({ user_idx: id });
    if (!user) {
      user = this.userRepository.create({
        user_idx: id,
        username: displayName,
        email: emails[0].value,
      });
      await this.userRepository.save(user);
    }
    return user;
  }
}

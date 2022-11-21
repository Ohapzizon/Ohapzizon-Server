import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { SocialRegisterTokenData } from '../token/types/token-data';
import { RegisterUserProfileDto } from './dto/register-user-profile.dto';
import SocialAccount from '../entities/social-account.entity';
import { UserService } from '../user/user.service';
import User from '../entities/user.entity';
import UserProfile from '../entities/user-profile.entity';
import AuthToken from '../entities/auth-token.entity';
import { SocialProfile } from './types/social-profile';
import { v4 as uuid } from 'uuid';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
    @Inject('SOCIAL_ACCOUNT_REPOSITORY')
    private readonly socialAccountRepository: Repository<SocialAccount>,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async socialRegister(
    { profile, provider, accessToken }: SocialRegisterTokenData,
    registerUserDto: RegisterUserProfileDto,
  ) {
    const existedUser: User | null = await this.userService.findOneByEmail(
      profile.email,
    );
    if (existedUser)
      throw new UnprocessableEntityException('User Is Already Exists');

    const user: User = new User();
    user.email = profile.email;
    user.name = profile.name;

    const userProfile: UserProfile = new UserProfile();
    userProfile.displayName = registerUserDto.displayName;
    userProfile.discordTag = registerUserDto.discordTag;
    userProfile.grade = registerUserDto.grade;
    userProfile.department = registerUserDto.department;
    if (profile?.thumbnail) userProfile.thumbnail = profile?.thumbnail;

    const authToken: AuthToken = new AuthToken();
    authToken.id = uuid();

    const socialAccount: SocialAccount = new SocialAccount();
    socialAccount.socialId = profile.socialId;
    socialAccount.provider = provider;
    socialAccount.accessToken = accessToken;

    const savedUserId: number = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        const savedUser = await transactionalEntityManager.save(user);

        userProfile.userId = savedUser.id;
        authToken.userId = savedUser.id;
        socialAccount.userId = savedUser.id;

        await transactionalEntityManager.save(userProfile);
        await transactionalEntityManager.save(authToken);
        await transactionalEntityManager.save(socialAccount);
        return savedUser.id;
      },
    );
    return this.userService.findOneByIdOrFail(savedUserId);
  }

  async socialLogin(
    accessToken: string,
    profile: SocialProfile,
    provider: string,
  ): Promise<User | string> {
    const existSocialAccount: SocialAccount =
      await this.socialAccountRepository.findOneBy({
        socialId: profile.socialId,
        provider: provider,
      });
    if (existSocialAccount) {
      const socialAccount: SocialAccount =
        await this.socialAccountRepository.findOneByOrFail({
          socialId: profile.socialId,
        });
      return socialAccount.user;
    }
    return this.tokenService.generateRegisterToken({
      profile: profile,
      accessToken: accessToken,
      provider: 'google',
    });
  }
}

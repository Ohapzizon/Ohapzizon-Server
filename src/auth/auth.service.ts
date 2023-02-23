import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { SocialRegisterTokenData } from '../token/types/token-data';
import { RegisterUserProfileDto } from './dto/register-user-profile.dto';
import SocialAccount from '../entities/social-account.entity';
import User from '../entities/user.entity';
import UserProfile from '../entities/user-profile.entity';
import AuthToken from '../entities/auth-token.entity';
import { SocialProfile } from './types/social-profile';
import { v4 as uuid } from 'uuid';
import { Repository } from 'typeorm';
import {
  AUTH_TOKEN_REPOSITORY,
  SOCIAL_ACCOUNT_REPOSITORY,
  USER_PROFILE_REPOSITORY,
  USER_REPOSITORY,
} from '../common/constants';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: Repository<User>,
    @Inject(USER_PROFILE_REPOSITORY)
    private readonly userProfileRepository: Repository<UserProfile>,
    @Inject(AUTH_TOKEN_REPOSITORY)
    private readonly authTokenRepository: Repository<AuthToken>,
    @Inject(SOCIAL_ACCOUNT_REPOSITORY)
    private readonly socialAccountRepository: Repository<SocialAccount>,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async register(
    { profile, provider, accessToken }: SocialRegisterTokenData,
    registerUserProfileDto: RegisterUserProfileDto,
    isSocial = false,
  ) {
    const existedUser: User | null = await this.userRepository.findOneBy({
      email: profile.email,
    });
    if (existedUser)
      throw new UnprocessableEntityException('User Is Already Exists');

    const user: User = this.userRepository.create({
      email: profile.email,
      name: profile.name,
    });

    const userProfile: UserProfile = this.userProfileRepository.create({
      displayName: registerUserProfileDto.displayName,
      discordTag: registerUserProfileDto.discordTag,
      grade: registerUserProfileDto.grade,
      department: registerUserProfileDto.department,
    });

    const authToken: AuthToken = this.authTokenRepository.create({
      id: uuid(),
    });

    const savedUserId: number = await this.userRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const savedUser = await transactionalEntityManager.save(user);

        userProfile.userId = savedUser.id;
        authToken.userId = savedUser.id;

        if (isSocial) {
          if (profile?.thumbnail)
            this.userProfileRepository.merge(userProfile, {
              thumbnail: profile?.thumbnail,
            });
          const socialAccount: SocialAccount =
            this.socialAccountRepository.create({
              socialId: profile.socialId,
              provider: provider,
              accessToken: accessToken,
            });
          socialAccount.userId = savedUser.id;
          await transactionalEntityManager.save(socialAccount);
        }

        await transactionalEntityManager.save(userProfile);
        await transactionalEntityManager.save(authToken);
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
      await this.socialAccountRepository.findOne({
        where: {
          socialId: profile.socialId,
          provider: provider,
        },
      });
    if (existSocialAccount)
      return this.userService.findOneByIdOrFail(existSocialAccount.userId);
    return this.tokenService.generateRegisterToken({
      profile: profile,
      accessToken: accessToken,
      provider: 'google',
    });
  }
}

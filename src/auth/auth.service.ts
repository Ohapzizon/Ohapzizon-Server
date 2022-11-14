import { BadRequestException, Injectable } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { SocialRegisterTokenData } from '../token/types/token-data';
import { RegisterUserProfileDto } from './dto/register-user-profile.dto';
import SocialAccount from '../entities/social-account.entity';
import { TokenDto } from '../token/dto/token.dto';
import { UserService } from '../user/user.service';
import dataSource from '../config/database/data-source';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import User from '../entities/user.entity';
import UserProfile from '../entities/user-profile.entity';
import AuthToken from '../entities/auth-token.entity';
import { userRepository } from '../user/user.repository';
import { userProfileRepository } from '../user/user-profile/user-profile.repository';
import { socialAccountRepository } from './social/social-account.repository';
import { authTokenRepository } from '../token/token.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async socialRegister(
    { profile, provider, accessToken }: SocialRegisterTokenData,
    registerUserDto: RegisterUserProfileDto,
    res: Response,
  ): Promise<LoginDto> {
    return await dataSource.transaction(async (transactionalEntityManager) => {
      const existedUser: boolean = await this.userService.isExistByEmail(
        profile.email,
      );
      if (existedUser) throw new BadRequestException('User Is Already Exists');
      const user: User = userRepository.create({
        email: profile.email,
        name: profile.name,
      });
      const savedUser = await transactionalEntityManager.save(User, user);
      const userProfile: UserProfile = userProfileRepository.create({
        displayName: registerUserDto.displayName,
        discordTag: registerUserDto.discordTag,
        grade: registerUserDto.grade,
        department: registerUserDto.department,
        user: { id: savedUser.id },
      });
      if (profile.thumbnail) userProfile.thumbnail = profile.thumbnail;
      const socialAccount: SocialAccount = socialAccountRepository.create({
        id: profile.socialId,
        provider: provider,
        accessToken: accessToken,
        user: { id: savedUser.id },
      });
      const authToken = authTokenRepository.create({
        user: { id: savedUser.id },
      });
      await transactionalEntityManager.save(UserProfile, userProfile);
      await transactionalEntityManager.save(SocialAccount, socialAccount);
      await transactionalEntityManager.save(AuthToken, authToken);
      const tokenDto: TokenDto = await this.tokenService.generateUserToken(
        user,
        userProfile,
        authToken,
      );
      this.tokenService.setTokenCookie(res, tokenDto);
      return new LoginDto(userProfile, tokenDto);
    });
  }

  async logOut(userId: number, res: Response): Promise<void> {
    await this.tokenService.disabledAuthTokenByUserId(userId);
    await this.tokenService.resetTokenCookie(res);
  }
}

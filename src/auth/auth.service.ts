import { Injectable } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { SocialRegisterTokenData } from '../token/types/token-data';
import { RegisterUserProfileDto } from '../user/dto/register-user-profile.dto';
import SocialAccount from '../entities/social-account.entity';
import { TokenDto } from '../token/dto/token.dto';
import { SocialProfile } from './social/types/social-profile';
import { UserService } from '../user/user.service';
import dataSource from '../config/database/data-source';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async socialRegister(
    socialRegisterTokenData: SocialRegisterTokenData,
    registerUserDto: RegisterUserProfileDto,
    res: Response,
  ): Promise<LoginDto> {
    const profile: SocialProfile = socialRegisterTokenData.profile;
    return await dataSource.transaction(async (transactionalEntityManager) => {
      const { user, userProfile } = await this.userService.register(
        profile,
        registerUserDto,
        transactionalEntityManager,
      );
      const socialAccountRepository =
        transactionalEntityManager.getRepository(SocialAccount);
      const socialAccount: SocialAccount = socialAccountRepository.create({
        socialId: socialRegisterTokenData.profile.id,
        provider: socialRegisterTokenData.provider,
        accessToken: socialRegisterTokenData.accessToken,
        user: { id: user.id },
      });
      await socialAccountRepository.save(socialAccount);
      const tokenDto: TokenDto = await this.tokenService.generateUserToken(
        user,
        userProfile,
        transactionalEntityManager,
      );
      this.tokenService.setTokenCookie(
        res,
        tokenDto.accessToken,
        tokenDto.refreshToken,
      );
      return new LoginDto(userProfile, tokenDto);
    });
  }

  async logOut(userId: string, res: Response): Promise<void> {
    await this.tokenService.disabledAuthTokenByUserId(userId);
    await this.tokenService.resetTokenCookie(res);
  }
}

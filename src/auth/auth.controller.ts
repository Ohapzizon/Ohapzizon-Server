import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Res,
} from '@nestjs/common';
import {
  AccessToken,
  RegisterToken,
} from '../common/decorators/token.decorator';
import { AuthService } from './auth.service';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '../common/decorators/auth.decorator';
import { ResponseEntity } from '../common/response/response.entity';
import { SocialRegisterTokenData } from '../token/types/token-data';
import { RegisterUserProfileDto } from './dto/register-user-profile.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutResponse } from './res/logout.response';
import { SocialRegisterResponse } from './res/social-register.response';
import { InternalServerError } from '../common/response/swagger/error/internal-server.error';
import { Response } from 'express';
import { RegisterAuth } from '../common/decorators/register-auth.decorator';
import { ProfileResponse } from './res/profile.response';
import { SocialProfileDto } from './dto/social-profile.dto';
import { CookieUtil } from '../common/utils/cookie.util';
import { TokenService } from '../token/token.service';
import { TokenDto } from '../token/dto/token.dto';
import User from '../entities/user.entity';

@ApiInternalServerErrorResponse({
  description: '서버 에러입니다.',
  type: InternalServerError,
})
@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly cookieUtil: CookieUtil,
  ) {}

  @ApiOperation({ summary: '소셜 계정 등록' })
  @ApiCreatedResponse({
    description: '소셜 계정 등록에 성공하였습니다.',
    type: SocialRegisterResponse,
  })
  @RegisterAuth()
  @HttpCode(201)
  @Post('')
  async socialRegister(
    @RegisterToken() socialRegisterTokenData: SocialRegisterTokenData,
    @Body() registerUserDto: RegisterUserProfileDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseEntity<LoginDto>> {
    const savedUser: User = await this.authService.socialRegister(
      socialRegisterTokenData,
      registerUserDto,
    );
    const tokens: TokenDto = await this.tokenService.generateUserToken(
      savedUser,
    );
    this.cookieUtil.setUserTokenCookie(res, tokens);
    return ResponseEntity.CREATED_WITH_DATA(
      '소셜 계정 등록에 성공하였습니다.',
      new LoginDto(savedUser, tokens),
    );
  }

  @ApiOperation({ summary: '프로필 조회' })
  @ApiOkResponse({
    description: '프로필 조회에 성공하였습니다.',
    type: ProfileResponse,
  })
  @ApiNotFoundResponse({
    description: '요청 값을 찾을 수 없습니다.',
  })
  @RegisterAuth()
  @Get('profile')
  async getSocialProfile(
    @RegisterToken('profile') profile: SocialProfileDto,
  ): Promise<ResponseEntity<SocialProfileDto>> {
    return ResponseEntity.OK_WITH_DATA(
      '프로필 조회에 성공하였습니다.',
      profile,
    );
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiOkResponse({
    description: '로그아웃에 성공하였습니다.',
    type: LogoutResponse,
  })
  @Auth()
  @Delete('')
  async logOut(
    @AccessToken('user_id') userId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseEntity<string>> {
    await this.tokenService.disabledAuthTokenByUserId(userId);
    this.cookieUtil.resetTokenCookie(res);
    return ResponseEntity.OK_WITH('로그아웃에 성공하였습니다.');
  }
}

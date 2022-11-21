import { Controller, Get, Query, Redirect, Res } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseEntity } from '../../common/response/response.entity';
import { LoginDto } from '../dto/login.dto';
import { LoginResponse } from '../res/login.response';
import { InternalServerError } from '../../common/response/swagger/error/internal-server.error';
import { Response } from 'express';
import { TokenService } from '../../token/token.service';
import { CookieUtil } from '../../common/utils/cookie.util';
import { AuthService } from '../auth.service';
import User from '../../entities/user.entity';
import { TokenDto } from '../../token/dto/token.dto';

@ApiInternalServerErrorResponse({
  description: '서버 에러입니다.',
  type: InternalServerError,
})
@ApiTags('google-auth')
@Controller('auth/google')
export class GoogleAuthController {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly cookieUtil: CookieUtil,
  ) {}

  @ApiOperation({ summary: '구글 인증 페이지 리다이렉션' })
  @Get('')
  @Redirect()
  getGoogleRedirectURL() {
    return this.googleAuthService.getGoogleRedirectURL();
  }

  @ApiOperation({ summary: '구글 로그인' })
  @ApiOkResponse({
    description: '구글 로그인에 성공하였습니다.',
    type: LoginResponse,
  })
  @Get('callback')
  async googleLogIn(
    @Query('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseEntity<LoginDto | { registerToken: string }>> {
    const userOrRegisterToken: User | string =
      await this.googleAuthService.googleLogin(code);
    if (userOrRegisterToken instanceof User) {
      const tokenDto: TokenDto = await this.tokenService.generateUserToken(
        userOrRegisterToken,
      );
      this.cookieUtil.setUserTokenCookie(res, tokenDto);
      return ResponseEntity.OK_WITH_DATA(
        '구글 로그인에 성공하였습니다.',
        new LoginDto(userOrRegisterToken, tokenDto),
      );
    } else {
      this.cookieUtil.setRegisterTokenCookie(res, userOrRegisterToken);
      return ResponseEntity.OK_WITH_DATA('구글 로그인에 성공하였습니다.', {
        registerToken: userOrRegisterToken,
      });
    }
  }
}

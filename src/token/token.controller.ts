import { Controller, Get, Res } from '@nestjs/common';
import { TokenService } from './token.service';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseEntity } from '../common/response/response.entity';
import {
  AccessToken,
  RefreshToken,
} from '../common/decorators/token.decorator';
import { RefreshTokenData } from './types/token-data';
import { TokenDto } from './dto/token.dto';
import { RefreshTokenResponse } from './res/refresh-token.response';
import { InternalServerError } from '../common/response/swagger/error/internal-server.error';
import { Response } from 'express';
import { userByIdPipe } from '../common/pipe/user-by-id.pipe';
import User from '../entities/user.entity';
import { RefreshAuth } from '../common/decorators/refresh-auth.decorator';
import { CookieUtil } from '../common/utils/cookie.util';
import { LoginDto } from '../auth/dto/login.dto';

@ApiInternalServerErrorResponse({
  description: '서버 에러입니다.',
  type: InternalServerError,
})
@ApiTags('token')
@Controller('token')
export class TokenController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly cookieUtil: CookieUtil,
  ) {}

  @ApiOperation({ summary: '토큰 재발급' })
  @ApiOkResponse({
    description: '토큰 재발급에 성공하였습니다.',
    type: RefreshTokenResponse,
  })
  @RefreshAuth()
  @Get()
  async refreshToken(
    @AccessToken('user_id', userByIdPipe) currentUser: User,
    @RefreshToken() refreshTokenData: RefreshTokenData,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseEntity<LoginDto>> {
    const tokenDto: TokenDto = await this.tokenService.refreshUserToken(
      currentUser,
      refreshTokenData,
    );
    this.cookieUtil.setUserTokenCookie(res, tokenDto);
    return ResponseEntity.OK_WITH_DATA(
      '토큰 재발급에 성공하였습니다.',
      new LoginDto(currentUser, tokenDto),
    );
  }
}

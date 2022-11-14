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
import { userByIdPipe } from '../user/pipe/user-by-id.pipe';
import User from '../entities/user.entity';
import { RefreshAuth } from '../common/decorators/refresh-auth.decorator';

@ApiInternalServerErrorResponse({
  description: '서버 에러입니다.',
  type: InternalServerError,
})
@ApiTags('token')
@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

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
  ): Promise<ResponseEntity<TokenDto>> {
    const data: TokenDto = await this.tokenService.refreshUserToken(
      currentUser,
      currentUser.profile,
      refreshTokenData,
      res,
    );
    return ResponseEntity.OK_WITH_DATA('토큰 재발급에 성공하였습니다.', data);
  }
}

import { Controller, Get, Query, Redirect, Res } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseEntity } from '../../../common/response/response.entity';
import { LoginDto } from '../../dto/login.dto';
import { LoginResponse } from '../../res/login.response';
import { InternalServerError } from '../../../common/response/swagger/error/internal-server.error';
import { Response } from 'express';

@ApiInternalServerErrorResponse({
  description: '서버 에러입니다.',
  type: InternalServerError,
})
@ApiTags('google-auth')
@Controller('auth/google')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

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
    const data = await this.googleAuthService.googleLogIn(code, res);
    return ResponseEntity.OK_WITH_DATA('로그인에 성공하였습니다.', data);
  }
}

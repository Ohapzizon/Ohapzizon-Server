import {
  Controller,
  Get,
  Query,
  Redirect,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import {
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseEntity } from '../../../common/response/response.entity';
import { SocialRegisterAuthGuard } from '../../guard/social-register-auth.guard';
import { RegisterToken } from '../../../common/decorators/token.decorator';
import { LoginDto } from '../../dto/login.dto';
import { LoginResponse } from '../../res/login.response';
import { ProfileResponse } from '../../res/profile.response';
import { SocialProfileDto } from '../../dto/social-profile.dto';
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

  @ApiOperation({ summary: '프로필 조회' })
  @ApiOkResponse({
    description: '프로필 조회에 성공하였습니다.',
    type: ProfileResponse,
  })
  @ApiNotFoundResponse({
    description: '요청 값을 찾을 수 없습니다.',
  })
  @ApiHeader({ name: 'register_token' })
  @UseGuards(SocialRegisterAuthGuard)
  @Get('profile')
  async getSocialProfile(
    @RegisterToken('profile') profile: SocialProfileDto,
  ): Promise<ResponseEntity<SocialProfileDto>> {
    return ResponseEntity.OK_WITH_DATA(
      '프로필 조회에 성공하였습니다.',
      profile,
    );
  }
}

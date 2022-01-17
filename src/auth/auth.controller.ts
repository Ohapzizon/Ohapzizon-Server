import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserDecorator } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import User from '../entities/user.entity';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { GoogleCodeDto } from './dto/google-code.dto';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { TokenDto } from '../token/dto/token.dto';

@ApiTags('Authentication')
@Controller('auth/google')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {}

  @ApiOperation({ summary: '구글 인증 페이지 리다이렉션' })
  @Get('')
  async googleAuth(@Res() res) {
    const hostName = 'https://accounts.google.com';
    const clientID = this.configService.get<string>('CLIENT_ID');
    const callbackURL = this.configService.get<string>('CALLBACK_URL');
    const scope = 'email+profile'; // URL 인코딩 시 "+"은 "%20"으로 표현된다.
    res.redirect(
      `${hostName}/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&redirect_uri=${callbackURL}&scope=${scope}&client_id=${clientID}`,
    );
  }

  @ApiOperation({ summary: '구글 로그인' })
  @ApiBody({ type: GoogleCodeDto })
  @ApiOkResponse({ description: '로그인 성공(토큰 발급)' })
  @ApiUnauthorizedResponse({ description: '구글 인증에 실패했습니다.' })
  @HttpCode(HttpStatus.OK)
  @Post('')
  async googleAuthRedirect(@Body() googleCodeDto: GoogleCodeDto) {
    const { email, name } = await this.userService.getGoogleUserInfo(
      googleCodeDto,
    );
    const data: TokenDto = await this.tokenService.createTokens(email, name);
    return {
      status: 200,
      message: '구글 로그인을 성공하였습니다.',
      data,
    };
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiOkResponse({ description: '로그아웃 성공(Refresh 토큰 삭제)' })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  async logout(@UserDecorator() user: User) {
    await this.authService.logout(user.user_idx);
    return {
      status: 200,
      message: '로그아웃을 성공하였습니다.',
    };
  }
}

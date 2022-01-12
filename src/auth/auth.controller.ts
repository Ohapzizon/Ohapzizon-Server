import { Controller, Delete, Get, Res, UseGuards } from '@nestjs/common';
import { UserDecorator } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import User from '../entities/user.entity';
import { AuthService } from './auth.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@Controller('auth/google')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('')
  async googleAuth(@Res() res) {
    const hostName = 'https://accounts.google.com';
    const clientID = this.configService.get<string>('CLIENT_ID');
    const callbackURL = this.configService.get<string>('CALLBACK_URL');
    const scope = 'email+profile'; // URL 인코딩 시 스페이스는 "+" 혹은 "%20"으로 표현된다.
    res.redirect(
      `${hostName}/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&redirect_uri=${callbackURL}&scope=${scope}&client_id=${clientID}`,
    );
  }

  @Get('callback')
  async googleAuthRedirect(@UserDecorator() user: User): Promise<any> {
    const data = await this.authService.login(user.email, user.name);
    return {
      status: 200,
      message: '구글 로그인을 성공하였습니다.',
      data: data,
    };
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  async logout(@UserDecorator() user: User): Promise<any> {
    await this.authService.logout(user.user_idx);
    return {
      status: 200,
      message: '로그아웃을 성공하였습니다.',
    };
  }
}

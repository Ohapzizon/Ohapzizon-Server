import { Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { UserDecorator } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import User from '../entities/user.entity';
import { AuthService } from './auth.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth/google')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleAuthGuard)
  @Get('')
  async googleAuth() {}

  @UseGuards(GoogleAuthGuard)
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

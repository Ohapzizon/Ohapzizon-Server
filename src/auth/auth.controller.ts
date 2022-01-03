import {
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { UserDecorator } from '../common/decorators/user.decorator';
import { TokenService } from '../token/token.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import User from '../entities/user.entity';
import { AuthService } from './auth.service';

@Controller('auth/google')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleAuthGuard)
  @Get('')
  async googleAuth() {}

  @UseGuards(GoogleAuthGuard)
  @Get('callback')
  async googleAuthRedirect(@UserDecorator() user) {
    await this.authService.login(user.email, user.username);
    return {
      status: 200,
      message: '구글 로그인을 성공하였습니다.',
    };
  }

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

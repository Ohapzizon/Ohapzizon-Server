import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { User } from '../common/decorators/user.decorator';

@Controller('auth/google')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@User() user) {
    return this.authService.login(user);
  }
}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtRefreshGuard } from '../auth/guard/jwt-refresh.guard';
import { UserDecorator } from '../common/decorators/user.decorator';
import { TokenDto } from './dto/token.dto';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@UserDecorator() user) {
    const data: TokenDto = await this.tokenService.createTokens(
      user.email,
      user.username,
    );
    return {
      status: 200,
      message: '토큰을 재발급하였습니다.',
      data: data,
    };
  }
}

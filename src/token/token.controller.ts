import { Controller, Get, UseGuards } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtRefreshGuard } from '../auth/guard/jwt-refresh.guard';
import { UserDecorator } from '../common/decorators/user.decorator';
import { TokenDto } from './dto/token.dto';
import User from '../entities/user.entity';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@UserDecorator() user: User) {
    const data: TokenDto = await this.tokenService.createTokens(
      user.email,
      user.name,
    );
    return {
      status: 200,
      message: '토큰을 재발급하였습니다.',
      data: data,
    };
  }
}

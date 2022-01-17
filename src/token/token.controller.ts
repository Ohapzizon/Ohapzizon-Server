import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtRefreshGuard } from '../auth/guard/jwt-refresh.guard';
import { UserDecorator } from '../common/decorators/user.decorator';
import User from '../entities/user.entity';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Refresh')
@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @ApiOperation({ summary: '토큰 재발급' })
  @ApiBearerAuth('accessToken')
  @ApiHeader({
    name: 'refresh',
    required: true,
    description: 'Refresh Token',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@UserDecorator() user: User) {
    const accessToken = this.tokenService.createAccessToken(
      user.email,
      user.name,
    );
    const refreshToken = this.tokenService.createRefreshToken(user.name);
    return {
      status: 200,
      message: '토큰을 재발급하였습니다.',
      data: {
        username: user.name,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
  }
}

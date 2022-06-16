import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtRefreshGuard } from '../auth/guard/jwt-refresh.guard';
import { UserDecorator } from '../common/decorators/user.decorator';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ReissuanceDto } from './dto/reissuance.dto';
import { ReissuanceResponse } from './response/reissuance.response';

@ApiTags('Refresh')
@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @ApiOperation({ summary: '토큰 재발급' })
  @ApiHeader({
    name: 'refresh',
    required: true,
    description: 'Refresh Token',
  })
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth('accessToken')
  @Get('refresh')
  async refresh(
    @UserDecorator('userId') userId: string,
  ): Promise<ReissuanceResponse> {
    const token: ReissuanceDto = await this.tokenService.reissuanceToken(
      userId,
    );
    return new ReissuanceResponse(
      HttpStatus.OK,
      '토큰을 재발급하였습니다.',
      token,
    );
  }
}

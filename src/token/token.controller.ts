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
import BaseResponse from '../common/response/base.response';
import ReissuanceDto from './dto/reissuance.dto';

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
  refresh(@UserDecorator() user: User): BaseResponse<ReissuanceDto> {
    const token: string = this.tokenService.createAccessToken(
      user.email,
      user.name,
    );
    return new BaseResponse<ReissuanceDto>(
      HttpStatus.OK,
      '토큰을 재발급하였습니다.',
      { token },
    );
  }
}

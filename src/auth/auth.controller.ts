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
import { GoogleCodeDto } from './dto/google-code.dto';
import BaseResponse from '../common/response/base.response';
import LoginResponseData from './dto/login-response.dto';

@ApiTags('Authentication')
@Controller('auth/google')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '구글 인증 페이지 리다이렉션' })
  @Get('')
  getOAuthRedirectURL(@Res() res): void {
    return this.authService.getOAuthRedirectURL(res);
  }

  @ApiOperation({ summary: '구글 로그인' })
  @ApiBody({ type: GoogleCodeDto })
  @ApiOkResponse({ description: '로그인 성공(토큰 발급)' })
  @ApiUnauthorizedResponse({ description: '구글 인증에 실패했습니다.' })
  @HttpCode(HttpStatus.OK)
  @Post('')
  async logIn(
    @Body() googleCodeDto: GoogleCodeDto,
  ): Promise<BaseResponse<LoginResponseData>> {
    const data: LoginResponseData = await this.authService.logIn(googleCodeDto);
    return new BaseResponse<LoginResponseData>(
      HttpStatus.OK,
      '구글 로그인을 성공하였습니다.',
      data,
    );
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiOkResponse({ description: '로그아웃 성공(Refresh 토큰 삭제)' })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  async logout(@UserDecorator() user: User): Promise<BaseResponse<void>> {
    await this.authService.logOut(user.user_id);
    return new BaseResponse<void>(HttpStatus.OK, '로그아웃을 성공하였습니다.');
  }
}

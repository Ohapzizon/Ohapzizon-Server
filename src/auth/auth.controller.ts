import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  ParseIntPipe,
  Post,
  Redirect,
} from '@nestjs/common';
import { UserDecorator } from '../common/decorators/user.decorator';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GoogleCodeDto } from './dto/google-code.dto';
import BaseResponse from '../common/response/base.response';
import { LoginResponse } from './response/login.response';
import { Auth } from '../common/decorators/auth.decorator';
import { Role } from '../user/enum/role';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '구글 인증 페이지 리다이렉션' })
  @Get('google')
  @Redirect()
  getGoogleRedirectURL() {
    return this.authService.getGoogleRedirectURL();
  }

  @ApiOperation({ summary: '구글 로그인' })
  @Post('google')
  async googleLogin(
    @Body() googleCodeDto: GoogleCodeDto,
  ): Promise<LoginResponse> {
    const data: LoginDto = await this.authService.googleLogIn(googleCodeDto);
    return new LoginResponse(
      HttpStatus.CREATED,
      '구글 로그인을 성공하였습니다.',
      data,
    );
  }

  @ApiOperation({ summary: '로그아웃' })
  @Auth(Role.USER)
  @Delete('')
  async logout(
    @UserDecorator('userId', ParseIntPipe) userId: number,
  ): Promise<BaseResponse<void>> {
    await this.authService.logOut(userId);
    return new BaseResponse<void>(
      HttpStatus.NO_CONTENT,
      '로그아웃을 성공하였습니다.',
    );
  }
}

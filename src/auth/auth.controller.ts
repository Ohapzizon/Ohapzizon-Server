import { Body, Controller, Delete, HttpCode, Post, Res } from '@nestjs/common';
import {
  AccessToken,
  RegisterToken,
} from '../common/decorators/token.decorator';
import { AuthService } from './auth.service';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '../common/decorators/auth.decorator';
import { ResponseEntity } from '../common/response/response.entity';
import { SocialRegisterTokenData } from '../token/types/token-data';
import { RegisterUserProfileDto } from '../user/dto/register-user-profile.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutResponse } from './res/logout.response';
import { SocialRegisterResponse } from './res/social-register.response';
import { InternalServerError } from '../common/response/swagger/error/internal-server.error';
import { Response } from 'express';
import { SocialRegisterAuth } from '../common/decorators/social-register-auth.decorator';

@ApiInternalServerErrorResponse({
  description: '서버 에러입니다.',
  type: InternalServerError,
})
@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '소셜 계정 등록' })
  @ApiCreatedResponse({
    description: '소셜 계정 등록에 성공하였습니다.',
    type: SocialRegisterResponse,
  })
  @SocialRegisterAuth()
  @HttpCode(201)
  @Post('')
  async socialRegister(
    @RegisterToken() socialRegisterTokenData: SocialRegisterTokenData,
    @Body() registerUserDto: RegisterUserProfileDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseEntity<LoginDto>> {
    const data: LoginDto = await this.authService.socialRegister(
      socialRegisterTokenData,
      registerUserDto,
      res,
    );
    return ResponseEntity.CREATED_WITH_DATA(
      '소셜 계정 등록에 성공하였습니다.',
      data,
    );
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiOkResponse({
    description: '로그아웃에 성공하였습니다.',
    type: LogoutResponse,
  })
  @Auth()
  @Delete('')
  async logOut(
    @AccessToken('sub') userId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseEntity<string>> {
    await this.authService.logOut(userId, res);
    return ResponseEntity.OK_WITH('로그아웃에 성공하였습니다.');
  }
}

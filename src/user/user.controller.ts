import { Controller, Delete, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDecorator } from '../common/decorators/user.decorator';
import BaseResponse from '../common/response/base.response';
import { Auth } from '../common/decorators/auth.decorator';
import { Role } from './enum/role';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '회원 탈퇴' })
  @Auth(Role.USER)
  @Delete('')
  async withdrawal(
    @UserDecorator('userId') userId: string,
  ): Promise<BaseResponse<void>> {
    await this.userService.withdrawal(userId);
    return new BaseResponse<void>(
      HttpStatus.NO_CONTENT,
      '회원 탈퇴에 성공하였습니다.',
    );
  }
}

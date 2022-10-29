import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from './enum/role';
import { Auth } from '../common/decorators/auth.decorator';
import { UserService } from './user.service';
import { AccessToken } from '../common/decorators/token.decorator';
import { ResponseEntity } from '../common/response/response.entity';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ShowUserProfileDto } from './dto/show-user-profile.dto';
import { FindUserResponse } from './res/find-user.response';
import { InternalServerError } from '../common/response/swagger/error/internal-server.error';
import { NotFoundError } from '../common/response/swagger/error/not-found.error';

@ApiInternalServerErrorResponse({
  description: '서버 에러입니다.',
  type: InternalServerError,
})
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '프로필 조회' })
  @ApiOkResponse({
    description: '프로필 조회에 성공하였습니다.',
    type: FindUserResponse,
  })
  @ApiNotFoundResponse({
    description: '요청하신 자료를 찾을 수 없습니다.',
    type: NotFoundError,
  })
  @Get(':userProfileId')
  async findUserProfile(
    @Param('userProfileId') userProfileId: string,
  ): Promise<ResponseEntity<ShowUserProfileDto>> {
    const data: ShowUserProfileDto =
      await this.userService.findUserProfileByIdOrFail(userProfileId);
    return ResponseEntity.OK_WITH_DATA('프로필 조회에 성공하였습니다.', data);
  }

  @ApiOperation({ summary: '내 프로필 수정' })
  @Auth(Role.USER)
  @Patch()
  async updateProfile(
    @AccessToken('sub') userId: string,
    @Body() updateUserDto: UpdateUserProfileDto,
  ) {
    await this.userService.updateProfileByUserId(userId, updateUserDto);
    return ResponseEntity.OK_WITH('사용자 정보 수정에 성공하였습니다.');
  }
}

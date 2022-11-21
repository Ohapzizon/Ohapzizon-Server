import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '../common/decorators/auth.decorator';
import { AccessToken } from '../common/decorators/token.decorator';
import { ResponseEntity } from '../common/response/response.entity';
import { UserProfileService } from './user-profile/user-profile.service';
import { FindUserProfileResponse } from './user-profile/res/find-user-profile.response';
import { NotFoundError } from '../common/response/swagger/error/not-found.error';
import { UpdateUserProfileDto } from './user-profile/dto/update-user-profile.dto';
import { InternalServerError } from '../common/response/swagger/error/internal-server.error';
import { UpdateUserProfileResponse } from './user-profile/res/update-user-profile.response';
import { ShowUserProfileDto } from './user-profile/dto/show-user-profile.dto';

@ApiInternalServerErrorResponse({
  description: '서버 에러입니다.',
  type: InternalServerError,
})
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @ApiOperation({ summary: '프로필 조회' })
  @ApiOkResponse({
    description: '프로필 조회에 성공하였습니다.',
    type: FindUserProfileResponse,
  })
  @ApiNotFoundResponse({
    description: '요청하신 자료를 찾을 수 없습니다.',
    type: NotFoundError,
  })
  @Get('profile/:userId')
  async findUserProfile(
    @Param('userId') userId: number,
  ): Promise<ResponseEntity<ShowUserProfileDto>> {
    return ResponseEntity.OK_WITH_DATA(
      '프로필 조회에 성공하였습니다.',
      await this.userProfileService.findShowUserProfileDtoById(userId),
    );
  }

  @ApiOperation({
    summary: '내 프로필 수정',
    description: '자신의 프로필을 수정합니다.',
  })
  @ApiOkResponse({
    description: '프로필 수정에 성공하였습니다.',
    type: UpdateUserProfileResponse,
  })
  @Auth()
  @Patch('profile')
  async updateProfile(
    @AccessToken('user_id') userId: number,
    @Body() updateUserDto: UpdateUserProfileDto,
  ) {
    await this.userProfileService.updateProfileByUserId(userId, updateUserDto);
    return ResponseEntity.OK_WITH('프로필 수정에 성공하였습니다.');
  }
}

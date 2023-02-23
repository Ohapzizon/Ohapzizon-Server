import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { InternalServerError } from '../../common/response/swagger/error/internal-server.error';
import { UserProfileService } from './user-profile.service';
import { FindUserProfileResponse } from './res/find-user-profile.response';
import { NotFoundError } from '../../common/response/swagger/error/not-found.error';
import { ShowUserProfileDto } from './dto/show-user-profile.dto';
import { ResponseEntity } from '../../common/response/response.entity';
import { UpdateUserProfileResponse } from './res/update-user-profile.response';
import { Auth } from '../../common/decorators/auth.decorator';
import { AccessToken } from '../../common/decorators/token.decorator';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@ApiInternalServerErrorResponse({
  description: '서버 에러입니다.',
  type: InternalServerError,
})
@ApiTags('user-profile')
@Controller('profile')
export class UserController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @ApiOperation({ summary: '본인 프로필 조회' })
  @ApiOkResponse({
    description: '본인 프로필 조회에 성공하였습니다.',
    type: FindUserProfileResponse,
  })
  @ApiNotFoundResponse({
    description: '요청하신 자료를 찾을 수 없습니다.',
    type: NotFoundError,
  })
  @Get('')
  async findUserProfile(
    @AccessToken('user_id') userId: number,
  ): Promise<ResponseEntity<ShowUserProfileDto>> {
    return ResponseEntity.OK_WITH_DATA(
      '본인 프로필 조회에 성공하였습니다.',
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
  @Patch('')
  async updateProfile(
    @AccessToken('user_id') userId: number,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    await this.userProfileService.updateProfileByUserId(
      userId,
      updateUserProfileDto,
    );
    return ResponseEntity.OK_WITH('프로필 수정에 성공하였습니다.');
  }
}

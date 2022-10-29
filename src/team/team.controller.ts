import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TeamService } from './team.service';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AccessToken } from '../common/decorators/token.decorator';
import { Auth } from '../common/decorators/auth.decorator';
import { Role } from '../user/enum/role';
import { Status } from './enum/status';
import { ResponseEntity } from '../common/response/response.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { ShowTeamDto } from './dto/show-team.dto';
import { JoinTeamResponse } from './res/join-team.response';
import { FindTeamResponse } from './res/find-team.response';
import { AcceptJoinResponse } from './res/accept-join.response';
import { RejectJoinResponse } from './res/reject-join.response';
import { CancelJoinResponse } from './res/cancel-join.response';
import { NotFoundError } from '../common/response/swagger/error/not-found.error';
import { InternalServerError } from '../common/response/swagger/error/internal-server.error';
import { ShowPostDto } from '../post/dto/show-post.dto';
import { FindMyJoinedPostResponse } from './res/find-my-joined-post.response';
import { postExistPipe } from '../common/pipe/post-exist.pipe';
import { teamExistPipe } from '../common/pipe/team-exist.pipe';

@ApiInternalServerErrorResponse({
  description: '서버 에러입니다.',
  type: InternalServerError,
})
@ApiNotFoundResponse({
  description: '요청하신 자료를 찾을 수 없습니다.',
  type: NotFoundError,
})
@ApiTags('team')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @ApiOperation({ summary: '모집글 참여 신청' })
  @ApiCreatedResponse({
    description: '참여에 성공하였습니다.',
    type: JoinTeamResponse,
  })
  @Auth(Role.USER)
  @HttpCode(201)
  @Post(':postId')
  async join(
    @Param('postId', postExistPipe) postId: number,
    @AccessToken('sub') userId: string,
    @Body() createTeamDto: CreateTeamDto,
  ): Promise<ResponseEntity<ShowTeamDto[]>> {
    const data: ShowTeamDto[] = await this.teamService.join(
      postId,
      userId,
      createTeamDto,
    );
    return ResponseEntity.CREATED_WITH_DATA(
      '모집글 참여 신청에 성공하였습니다.',
      data,
    );
  }

  @ApiOperation({
    summary: '신청자 명단 조회',
    description:
      'postId로 모집글을 조회해서 해당 모집글의 신청자 명단을 조회합니다.',
  })
  @ApiOkResponse({
    description: '신청자 명단 조회에 성공하였습니다.',
    type: FindTeamResponse,
  })
  @Get('')
  async findTeamByPostId(
    @Query('postId', postExistPipe) postId: number,
  ): Promise<ResponseEntity<ShowTeamDto[]>> {
    const data: ShowTeamDto[] = await this.teamService.findShowTeamDtoByPostId(
      postId,
    );
    return ResponseEntity.OK_WITH_DATA(
      '신청자 명단 조회에 성공하였습니다.',
      data,
    );
  }

  @ApiOperation({
    summary: '참여한 모집글 조회',
    description: '자신이 참여한 모집글을 조회합니다.',
  })
  @ApiOkResponse({
    description: '참여한 모집글 조회에 성공하였습니다.',
    type: FindMyJoinedPostResponse,
  })
  @Auth()
  @Get('mypost')
  async findMyJoinedPostByUserId(
    @AccessToken('sub') userId: string,
  ): Promise<ResponseEntity<ShowPostDto[]>> {
    const data: ShowPostDto[] = await this.teamService.findMyJoinedPost(userId);
    return ResponseEntity.OK_WITH_DATA(
      '참여한 모집글 조회에 성공하였습니다.',
      data,
    );
  }

  @ApiOperation({ summary: '신청 수락' })
  @ApiOkResponse({
    description: '신청 수락에 성공하였습니다.',
    type: AcceptJoinResponse,
  })
  @Auth(Role.USER)
  @Patch('accept/:teamId')
  async acceptJoinRequest(
    @Param('teamId', teamExistPipe) teamId: number,
    @AccessToken('sub') userId: string,
  ): Promise<ResponseEntity<string>> {
    await this.teamService.updateStatus(teamId, userId, Status.ACCEPT);
    return ResponseEntity.OK_WITH('신청 수락에 성공하였습니다.');
  }

  @ApiOperation({ summary: '신청 거절' })
  @ApiOkResponse({
    description: '신청 거절에 성공하였습니다.',
    type: RejectJoinResponse,
  })
  @Auth(Role.USER)
  @Patch('reject/:teamId')
  async rejectJoinRequest(
    @Param('teamId', teamExistPipe) teamId: number,
    @AccessToken('sub') userId: string,
  ): Promise<ResponseEntity<string>> {
    await this.teamService.updateStatus(teamId, userId, Status.REJECT);
    return ResponseEntity.OK_WITH('신청 거절에 성공하였습니다.');
  }

  @ApiOperation({ summary: '참여 신청 취소' })
  @ApiOkResponse({
    description: '참여 신청 취소에 성공하였습니다.',
    type: CancelJoinResponse,
  })
  @Auth(Role.USER)
  @Delete(':postId')
  async cancelJoinRequest(
    @Param('postId', postExistPipe) postId: number,
    @AccessToken('sub') userId: string,
  ): Promise<ResponseEntity<string>> {
    await this.teamService.cancelJoinRequest(postId, userId);
    return ResponseEntity.OK_WITH('참여 신청 취소에 성공하였습니다.');
  }
}

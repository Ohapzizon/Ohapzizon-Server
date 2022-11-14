import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TeamService } from './team.service';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AccessToken } from '../common/decorators/token.decorator';
import { Auth } from '../common/decorators/auth.decorator';
import { ResponseEntity } from '../common/response/response.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { ShowTeamDto } from './dto/show-team.dto';
import { JoinTeamResponse } from './res/join-team.response';
import { FindTeamResponse } from './res/find-team.response';
import { AcceptJoinResponse } from './res/accept-join.response';
import { CancelJoinResponse } from './res/cancel-join.response';
import { NotFoundError } from '../common/response/swagger/error/not-found.error';
import { InternalServerError } from '../common/response/swagger/error/internal-server.error';
import { WriterGuard } from '../post/guard/writer.guard';
import { postByIdPipe } from '../post/pipe/post-by-id.pipe';
import PostEntity from '../entities/post.entity';
import { UpdateJoinStatusDto } from './dto/update-join-status.dto';

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
  @ApiQuery({ name: 'postId', required: true, type: Number })
  @Auth()
  @HttpCode(201)
  @Post('')
  async join(
    @Query('postId', ParseIntPipe, postByIdPipe) post: PostEntity,
    @AccessToken('user_id') userId: number,
    @Body() createTeamDto: CreateTeamDto,
  ): Promise<ResponseEntity<ShowTeamDto[]>> {
    const data: ShowTeamDto[] = await this.teamService.join(
      post,
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
  @ApiQuery({ name: 'postId', required: true, type: Number })
  @Get('')
  async findTeamByPostId(
    @Query('postId', ParseIntPipe, postByIdPipe) post: PostEntity,
  ): Promise<ResponseEntity<ShowTeamDto[]>> {
    const data: ShowTeamDto[] = await this.teamService.findShowTeamDtoByPostId(
      post.id,
    );
    return ResponseEntity.OK_WITH_DATA(
      '신청자 명단 조회에 성공하였습니다.',
      data,
    );
  }

  @ApiOperation({ summary: '신청 상태 변경' })
  @ApiOkResponse({
    description: '신청 상태 변경에 성공하였습니다.',
    type: AcceptJoinResponse,
  })
  @UseGuards(WriterGuard)
  @Auth()
  @Patch('status')
  async updateJoinStatus(
    @Query('teamId', ParseIntPipe) teamId: number,
    @Body() updateJoinStatusDto: UpdateJoinStatusDto,
  ): Promise<ResponseEntity<string>> {
    await this.teamService.updateJoinStatus(teamId, updateJoinStatusDto);
    return ResponseEntity.OK_WITH('신청 상태 변경에 성공하였습니다.');
  }

  @ApiOperation({ summary: '참여 신청 취소' })
  @ApiOkResponse({
    description: '참여 신청 취소에 성공하였습니다.',
    type: CancelJoinResponse,
  })
  @Auth()
  @Delete('')
  async cancelJoinRequest(
    @Query('teamId', ParseIntPipe) teamId: number,
    @AccessToken('user_id') userId: number,
  ): Promise<ResponseEntity<string>> {
    await this.teamService.cancelJoinRequest(teamId, userId);
    return ResponseEntity.OK_WITH('참여 신청 취소에 성공하였습니다.');
  }
}

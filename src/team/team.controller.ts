import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDecorator } from '../common/decorators/user.decorator';
import { ShowTeamDto } from './dto/show-team.dto';
import { Auth } from '../common/decorators/auth.decorator';
import BaseResponse from '../common/response/base.response';
import { Role } from '../user/enum/role';
import { Status } from './enum/status';
import { FindTeamResponse } from './response/find-team.response';

@ApiTags('Team')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @ApiOperation({ summary: '신청자 명단 조회' })
  @Get(':postIdx')
  async findAllByPostIdx(
    @Param('postIdx', ParseIntPipe) postIdx: number,
  ): Promise<FindTeamResponse> {
    const data: ShowTeamDto[] = await this.teamService.findShowTeamDtoByPostIdx(
      postIdx,
    );
    return new FindTeamResponse(
      HttpStatus.OK,
      '신청자 명단 조회에 성공하였습니다.',
      data,
    );
  }

  @ApiOperation({ summary: '참여' })
  @Auth(Role.USER)
  @HttpCode(HttpStatus.CREATED)
  @Post(':postIdx')
  async join(
    @Param('postIdx', ParseIntPipe) postIdx: number,
    @UserDecorator('userId') userId: string,
  ): Promise<FindTeamResponse> {
    const data: ShowTeamDto[] = await this.teamService.join(postIdx, userId);
    return new FindTeamResponse(HttpStatus.CREATED, '땡겨~', data);
  }

  @ApiOperation({ summary: '참여 수락' })
  @Auth(Role.USER)
  @Patch(':teamIdx/accept')
  async acceptJoin(
    @UserDecorator('userId') currentUserId: string,
    @Param('teamIdx') teamIdx: number,
  ): Promise<BaseResponse<void>> {
    await this.teamService.updateStatus(currentUserId, teamIdx, Status.ACCEPT);
    return new BaseResponse<void>(HttpStatus.OK, '수락에 성공하였습니다.');
  }

  @ApiOperation({ summary: '참여 거절' })
  @Auth(Role.USER)
  @Patch(':teamIdx/reject')
  async rejectJoin(
    @UserDecorator('userId') currentUserId: string,
    @Param('postIdx') teamIdx: number,
  ): Promise<BaseResponse<void>> {
    await this.teamService.updateStatus(currentUserId, teamIdx, Status.REJECT);
    return new BaseResponse<void>(HttpStatus.OK, '거절에 성공하였습니다.');
  }

  @ApiOperation({ summary: '참여 취소' })
  @Auth(Role.USER)
  @Delete(':teamIdx')
  async cancelJoin(
    @Param('teamIdx', ParseIntPipe) teamIdx: number,
  ): Promise<BaseResponse<void>> {
    await this.teamService.cancelJoin(teamIdx);
    return new BaseResponse<void>(HttpStatus.OK, '취소에 성공하였습니다.');
  }
}

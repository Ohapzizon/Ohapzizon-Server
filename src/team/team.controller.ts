import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Delete,
} from '@nestjs/common';
import { TeamService } from './team.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../common/decorators/user.decorator';
import { FindAllParticipantsRes, ShowTeamDto } from './dto/show-team.dto';
import { Auth } from '../common/decorators/auth.decorator';
import BaseResponse from '../common/response/base.response';
import { ShowUserDto } from '../user/dto/show-user.dto';
import { Role } from '../user/enum/role';
import { Status } from './enum/status';

@ApiTags('Team')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @ApiParam({
    name: 'postIdx',
    required: true,
    description: '조회할 게시글의 idx',
  })
  @ApiOperation({ summary: '신청자 명단 조회' })
  @ApiOkResponse({
    description: '신청자 명단 조회에 성공하였습니다.',
  })
  @Get(':postIdx')
  async findAllByPostIdx(
    @Param('postIdx', ParseIntPipe) postIdx: number,
  ): Promise<FindAllParticipantsRes> {
    const data: ShowTeamDto[] = await this.teamService.findByPostIdx(postIdx);
    return new FindAllParticipantsRes(
      HttpStatus.OK,
      '신청자 명단 조회에 성공하였습니다.',
      data,
    );
  }

  @Auth(Role.USER)
  @ApiOperation({ summary: '참여' })
  @ApiOkResponse({ description: '참여에 성공하였습니다.' })
  @ApiParam({
    name: 'postIdx',
    required: true,
    description: '참여할 게시글의 idx',
  })
  @Post(':postIdx')
  async join(
    @Param('postIdx', ParseIntPipe) postIdx: number,
    @User('userId') userId: string,
  ): Promise<FindAllParticipantsRes> {
    const data: ShowTeamDto[] = await this.teamService.join(postIdx, userId);
    return new FindAllParticipantsRes(HttpStatus.OK, '땡겨~', data);
  }

  @Auth(Role.USER)
  @ApiOperation({ summary: '참여 수락' })
  @ApiOkResponse({ description: '수락되었습니다.' })
  @ApiParam({
    name: 'userId',
    required: true,
    description: '참여를 수락 할 사용자의 id',
  })
  @Patch(':userId')
  async acceptJoin(
    @User() currentUser: ShowUserDto,
    @Param('userId') userId: string,
  ): Promise<BaseResponse<void>> {
    await this.teamService.updateStatus(currentUser, userId, Status.ACCEPT);
    return new BaseResponse<void>(HttpStatus.OK, '취소에 성공하였습니다.');
  }

  @Auth(Role.USER)
  @ApiOperation({ summary: '참여 거절' })
  @ApiOkResponse({ description: '거절되었습니다.' })
  @ApiParam({
    name: 'userId',
    required: true,
    description: '참여를 거절 할 사용자의 id',
  })
  @Patch(':userId')
  async rejectJoin(
    @User() currentUser: ShowUserDto,
    @Param('userId') userId: string,
  ): Promise<BaseResponse<void>> {
    await this.teamService.updateStatus(currentUser, userId, Status.REJECT);
    return new BaseResponse<void>(HttpStatus.OK, '취소에 성공하였습니다.');
  }

  @Auth(Role.USER)
  @ApiOperation({ summary: '참여 취소' })
  @ApiOkResponse({ description: '참여 취소에 성공하였습니다.' })
  @ApiParam({
    name: 'postIdx',
    required: true,
    description: '참여를 취소 할 게시글의 idx',
  })
  @Delete(':postIdx')
  async cancelJoin(
    @Param('postIdx', ParseIntPipe) postIdx: number,
    @User() currentUser: ShowUserDto,
  ): Promise<BaseResponse<void>> {
    await this.teamService.cancelJoin(postIdx, currentUser);
    return new BaseResponse<void>(HttpStatus.OK, '취소에 성공하였습니다.');
  }
}

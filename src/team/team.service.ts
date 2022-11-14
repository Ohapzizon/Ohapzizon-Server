import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import Team from '../entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { ShowTeamDto } from './dto/show-team.dto';
import { teamRepository } from './team.repository';
import Post from '../entities/post.entity';
import { PostStatus } from '../post/enum/post-status';
import { postRepository } from '../post/post.repository';
import { UpdateJoinStatusDto } from './dto/update-join-status.dto';

@Injectable()
export class TeamService {
  async findShowTeamDtoByPostId(postId: number): Promise<ShowTeamDto[]> {
    return teamRepository
      .findShowTeam()
      .where('post.id = :id', { id: postId })
      .innerJoin('t.post', 'post')
      .getRawMany<ShowTeamDto>();
  }

  async join(
    post: Post,
    userId: number,
    createTeamDto: CreateTeamDto,
  ): Promise<ShowTeamDto[]> {
    if (post.status === PostStatus.CLOSED)
      throw new BadRequestException('참가 모집이 마감된 글입니다.');
    const existTeam: boolean = await teamRepository.isExistByPostIdAndUserId(
      post.id,
      userId,
    );
    if (existTeam) throw new BadRequestException('이미 참가한 사용자입니다.');
    const team: Team = teamRepository.create({
      bio: createTeamDto.bio,
      post: { id: post.id },
      user: { id: userId },
    });
    await teamRepository.save(team);
    const count = await teamRepository.countBy({ post: { id: post.id } });
    if (post.limit <= count) {
      post.status = PostStatus.CLOSED;
      await postRepository.save(post);
    }
    return this.findShowTeamDtoByPostId(post.id);
  }

  async updateJoinStatus(
    teamId: number,
    updateJoinStatusDto: UpdateJoinStatusDto,
  ): Promise<void> {
    const team: Team = await teamRepository.findOneByIdOrFail(teamId);
    team.status = updateJoinStatusDto.joinStatus;
    await teamRepository.save(team);
  }

  async cancelJoinRequest(teamId: number, userId: number): Promise<void> {
    const team: Team = await teamRepository.findOneWithUserByIdOrFail(teamId);
    if (team.user.id !== userId)
      throw new ForbiddenException('신청자가 아닙니다.');
    await teamRepository.delete({ id: team.id });
  }
}

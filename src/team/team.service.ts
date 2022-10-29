import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Status } from './enum/status';
import Team from '../entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { ShowTeamDto } from './dto/show-team.dto';
import { ShowPostDto } from '../post/dto/show-post.dto';
import { teamRepository } from './team.repository';
import * as _ from 'lodash';
import Post from '../entities/post.entity';
import { PostService } from '../post/post.service';

@Injectable()
export class TeamService {
  constructor(private readonly postService: PostService) {}
  async findOneByIdOrFail(teamId: number): Promise<Team> {
    return teamRepository.findOneByIdOrFail(teamId);
  }

  async findOneByPostIdAndUserIdOrFail(
    postId: number,
    userId: string,
  ): Promise<Team> {
    return teamRepository.findOneByPostIdAndUserIdOrFail(postId, userId);
  }

  async findByPostId(postId: number): Promise<Team[]> {
    return teamRepository.findByPostId(postId);
  }

  async isExistById(teamId: number): Promise<boolean> {
    return teamRepository.isExistById(teamId);
  }

  async findShowTeamDtoByPostId(postId: number): Promise<ShowTeamDto[]> {
    return await teamRepository
      .findShowTeam()
      .innerJoin('t.post', 'p')
      .where('p.id = :id', { id: postId })
      .getRawMany<ShowTeamDto>();
  }

  async findMyJoinedPost(userId: string): Promise<ShowPostDto[]> {
    return await teamRepository
      .findShowPost()
      .innerJoin('t.user', 'participants')
      .where('participants.id = :id', { id: userId })
      .getRawMany<ShowPostDto>();
  }

  async join(
    postId: number,
    userId: string,
    createTeamDto: CreateTeamDto,
  ): Promise<ShowTeamDto[]> {
    const existTeam: Team[] = await this.findByPostId(postId);
    if (existTeam.find((team) => _.isEqual(team.user.id, userId)))
      throw new BadRequestException('이미 참가한 사용자입니다.');
    // TODO: post를 조회하지 않고, 참가 모집 마감을 확인하는 pipe를 제작
    // TODO: exist pipe에서 postId를 조회하지 않고 모집 마감 상태을 조회
    const post = await this.postService.findOneByIdOrFail(postId);
    if (post.limit <= existTeam.length)
      throw new BadRequestException('이미 참가 모집이 마감된 글입니다.');
    const team: Team = teamRepository.create({
      bio: createTeamDto.bio,
      user: { id: userId },
      post: { id: postId },
    });
    await teamRepository.save(team);
    return this.findShowTeamDtoByPostId(postId);
  }

  async updateStatus(
    teamId: number,
    userId: string,
    status: Status,
  ): Promise<void> {
    const team: Team = await this.findOneByIdOrFail(teamId);
    if (!_.isEqual(team.post.writer.id, userId))
      throw new ForbiddenException('작성자가 아닙니다.');
    await teamRepository.update(
      { user: { id: team.user.id } },
      { status: status },
    );
  }

  async cancelJoinRequest(postId: number, userId: string): Promise<void> {
    const team: Team = await this.findOneByPostIdAndUserIdOrFail(
      postId,
      userId,
    );
    await teamRepository.delete({ id: team.id });
  }
}

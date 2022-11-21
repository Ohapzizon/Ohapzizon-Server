import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import Team from '../entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { ShowTeamDto } from './dto/show-team.dto';
import Post from '../entities/post.entity';
import { UpdateJoinStatusDto } from './dto/update-join-status.dto';
import { Repository } from 'typeorm';
import User from '../entities/user.entity';

@Injectable()
export class TeamService {
  constructor(
    @Inject('TEAM_REPOSITORY')
    private readonly teamRepository: Repository<Team>,
  ) {}

  async join(
    post: Post,
    userId: number,
    createTeamDto: CreateTeamDto,
  ): Promise<ShowTeamDto[]> {
    const existTeam: Team | null = await this.teamRepository.findOneBy({
      postId: post.id,
      userId: userId,
    });
    if (existTeam) throw new BadRequestException('이미 참가한 사용자입니다.');
    const team: Team = this.teamRepository.create({
      bio: createTeamDto.bio,
      postId: post.id,
      userId: userId,
    });
    await this.teamRepository.save(team);
    return this.findShowTeamDtoByPostId(post.id);
  }

  async findOneByIdOrFail(teamId: number) {
    return this.teamRepository.findOneByOrFail({ id: teamId });
  }

  async findShowTeamDtoByPostId(postId: number): Promise<ShowTeamDto[]> {
    const team = await this.teamRepository.find({
      where: { postId: postId },
      select: {
        id: true,
        status: true,
        bio: true,
        user: { profile: { displayName: true } },
      },
      relations: { user: { profile: true } },
      loadRelationIds: false,
      relationLoadStrategy: 'query',
    });
    return team.map((team) => new ShowTeamDto(team));
  }

  async findWriterIdByIdFail(teamId: number): Promise<User> {
    const {
      post: { writer },
    }: Team = await this.teamRepository.findOneOrFail({
      select: {
        post: {
          writerId: true,
        },
      },
      where: { id: teamId },
      relations: { post: true },
      loadRelationIds: false,
    });
    return writer;
  }

  async updateJoinStatus(
    teamId: number,
    updateJoinStatusDto: UpdateJoinStatusDto,
  ): Promise<void> {
    await this.teamRepository.update(
      { id: teamId },
      { status: updateJoinStatusDto.joinStatus },
    );
  }

  async cancelJoinRequest(teamId: number): Promise<void> {
    await this.teamRepository.delete({ id: teamId });
  }
}

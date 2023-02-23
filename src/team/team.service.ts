import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Team from '../entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { ShowTeamDto } from './dto/show-team.dto';
import Post from '../entities/post.entity';
import { UpdateJoinStatusDto } from './dto/update-join-status.dto';
import { Repository } from 'typeorm';
import { TEAM_REPOSITORY } from '../common/constants';
import UserProfile from '../entities/user-profile.entity';

@Injectable()
export class TeamService {
  constructor(
    @Inject(TEAM_REPOSITORY)
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

  async findOneByIdOrFail(teamId: number): Promise<Team> {
    return (await this.teamRepository.findOneBy({ id: teamId }).then((team) => {
      if (!team) throw new NotFoundException();
    })) as Team;
  }

  async findShowTeamDtoByPostId(postId: number): Promise<ShowTeamDto[]> {
    const team: Team[] = (await this.teamRepository
      .createQueryBuilder('team')
      .select('team.id', 'id')
      .addSelect('team.status', 'status')
      .addSelect('team.bio', 'bio')
      .addSelect('userProfile.displayName', 'displayName')
      .leftJoin(UserProfile, 'userProfile')
      .where('team.postId = :postId', { postId: postId })
      .getOne()
      .then((team) => {
        if (!team) throw new NotFoundException();
      })) as Team[];
    return team.map((team) => new ShowTeamDto(team));
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

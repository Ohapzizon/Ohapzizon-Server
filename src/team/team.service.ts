import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { TeamRepository } from './team.repository';
import { PostService } from '../post/post.service';
import Team from '../entities/team.entity';
import { UserService } from '../user/user.service';
import { Status } from './enum/status';
import User from '../entities/user.entity';
import Post from '../entities/post.entity';
import { ShowTeamDto } from './dto/show-team.dto';
import { ShowTeamDtoBuilder } from './builder/show-team-dto.builder';

@Injectable()
export class TeamService {
  constructor(
    private readonly postService: PostService,
    private readonly teamRepository: TeamRepository,
    private readonly userService: UserService,
  ) {}

  async findByPostIdx(postIdx: number): Promise<Team[]> {
    const post: Post = await this.postService.findByPostIdx(postIdx);
    return this.teamRepository.find({ post: post });
  }

  async findShowTeamDtoByPostIdx(postIdx: number): Promise<ShowTeamDto[]> {
    const post: Post = await this.postService.findByPostIdx(postIdx);
    const team: Team[] = await this.teamRepository.find({ post: post });
    return team.map((team) =>
      new ShowTeamDtoBuilder()
        .setIdx(team.idx)
        .setStatus(team.status)
        .setParticipants(team.participants.name)
        .build(),
    );
  }

  async findByTeamIdx(teamIdx: number): Promise<Team> {
    return await this.teamRepository.findOneOrFail({ idx: teamIdx });
  }

  async join(postIdx: number, currentUserId: string): Promise<ShowTeamDto[]> {
    const post: Post = await this.postService.findByPostIdx(postIdx);
    const existingTeam: Team[] = await this.findByPostIdx(post.idx);
    if (post.maxCount <= existingTeam.length)
      throw new BadRequestException('이미 참가 모집이 마감된 글입니다.');
    const currentUser: User = await this.userService.findByUserId(
      currentUserId,
    );
    if (
      existingTeam.find(
        (team) =>
          JSON.stringify(team.participants) == JSON.stringify(currentUser),
      )
    )
      throw new BadRequestException('이미 참가한 사용자입니다.');
    const newTeam: Team = this.teamRepository.create({
      participants: currentUser,
    });
    newTeam.post = Promise.resolve(post); // promise 인스턴스 생성
    await this.teamRepository.save(newTeam);
    return this.findShowTeamDtoByPostIdx(post.idx);
  }

  async updateStatus(
    currentUserId: string,
    teamIdx: number,
    status: Status,
  ): Promise<void> {
    const team: Team = await this.findByTeamIdx(teamIdx);
    const post = await team.post;
    const currentUser: User = await this.userService.findByUserId(
      currentUserId,
    );
    if (JSON.stringify(post.writer) != JSON.stringify(currentUser))
      throw new ForbiddenException('작성자가 아닙니다.');
    await this.teamRepository.update(
      { participants: currentUser },
      { status: status },
    );
  }

  async cancelJoin(teamIdx: number): Promise<void> {
    const team: Team = await this.findByTeamIdx(teamIdx);
    await this.teamRepository.delete({ idx: team.idx });
  }
}

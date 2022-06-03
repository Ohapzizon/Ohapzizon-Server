import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TeamRepository } from './team.repository';
import { PostService } from '../post/post.service';
import { ShowPostDto } from '../post/dto/show-post.dto';
import Team from '../entities/team.entity';
import { ShowTeamDto } from './dto/show-team.dto';
import { ShowUserDto } from '../user/dto/show-user.dto';
import { UserService } from '../user/user.service';
import { Status } from './enum/status';
import User from '../entities/user.entity';

@Injectable()
export class TeamService {
  constructor(
    private readonly postService: PostService,
    private readonly teamRepository: TeamRepository,
    private readonly userService: UserService,
  ) {}

  async findByUserId(userId: string): Promise<ShowTeamDto> {
    const user: ShowUserDto = await this.userService.findUserByUserId(userId);
    const team = await this.teamRepository.findByUserId(user.userId);
    if (!team) throw new NotFoundException();
    return team;
  }

  async findByPostIdx(postIdx: number): Promise<ShowTeamDto[]> {
    const post: ShowPostDto = await this.postService.findShowPostDtoByPostIdx(postIdx);
    return await this.teamRepository.findByPostIdx(post.idx);
  }

  async join(postIdx: number, userId: string): Promise<ShowTeamDto[]> {
    const post: ShowPostDto = await this.postService.findShowPostDtoByPostIdx(postIdx);
    const user: User = await this.userService.findUserByUserId(userId);
    const team: ShowTeamDto[] = await this.findByPostIdx(post.idx);
    if (post.maxCount == team.length)
      throw new BadRequestException('이미 참가 모집이 마감된 글입니다.');
    if (team.find((team) => team.participant == user.name))
      throw new BadRequestException('이미 참가한 사용자입니다.');
    const newTeam: Team = this.teamRepository.create({
      user: user,
      post: post,
    });
    await this.teamRepository.save(newTeam);
    return this.findByPostIdx(post.idx);
  }

  async updateStatus(
    currentUser: ShowUserDto,
    userId: string,
    status: Status,
  ): Promise<void> {
    const team: ShowTeamDto = await this.findByUserId(userId);
    const post: ShowPostDto = await this.postService.findShowPostDtoByPostIdx(
      team.post.idx,
    );
    if (post.writer !== currentUser.name)
      throw new ForbiddenException('작성자가 아닙니다.');
    await this.teamRepository.update({ idx: team.idx }, { status: status });
  }

  async cancelJoin(postIdx: number, currentUser: ShowUserDto): Promise<void> {
    const post: ShowPostDto = await this.postService.findShowPostDtoByPostIdx(postIdx);
    await this.teamRepository.delete({ post: post, user: currentUser });
  }
}

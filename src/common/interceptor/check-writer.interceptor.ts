import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AccessTokenData } from '../../token/types/token-data';
import { PostService } from '../../post/post.service';
import { ModuleRef } from '@nestjs/core';
import { TeamService } from '../../team/team.service';
import Team from '../../entities/team.entity';

@Injectable()
export class CheckWriterInterceptor implements NestInterceptor {
  private teamService?: TeamService;
  constructor(
    private readonly postService: PostService,
    private readonly moduleRef: ModuleRef,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<void>> {
    const request = context.switchToHttp().getRequest();
    const accessToken: AccessTokenData = request.access_token;
    let postId: number | null = request.query?.postId;
    const teamId: number | null = request.query?.teamId;
    if (teamId) {
      this.teamService = await this.moduleRef.create(TeamService);
      const team: Team = await this.teamService.findOneByIdOrFail(teamId);
      postId = team.postId;
    }
    const writerId = await this.postService.findWriterIdByIdOrFail(postId);
    if (writerId !== accessToken.user_id)
      throw new ForbiddenException('작성자가 아닙니다.');
    return next.handle();
  }
}

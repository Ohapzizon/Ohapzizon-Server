import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AccessTokenData } from '../../token/types/token-data';
import User from '../../entities/user.entity';
import { PostService } from '../../post/post.service';
import { TeamService } from '../../team/team.service';

@Injectable()
export class CheckWriterInterceptor implements NestInterceptor {
  constructor(
    private readonly postService: PostService,
    private readonly teamService: TeamService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<void>> {
    const request = context.switchToHttp().getRequest();
    const accessToken: AccessTokenData = request.access_token;
    const postId = request.query?.postId;
    const teamId = request.query?.teamId;
    let writer: User;

    if (postId) writer = await this.teamService.findWriterIdByIdFail(teamId);
    if (teamId) writer = await this.postService.findWriterIdByIdFail(postId);
    if (writer.id !== accessToken.user_id)
      throw new ForbiddenException('작성자가 아닙니다.');
    return next.handle();
  }
}

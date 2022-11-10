import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AccessTokenData } from '../../token/types/token-data';
import User from '../../entities/user.entity';
import { PostService } from '../post.service';

@Injectable()
export class WriterGuard implements CanActivate {
  constructor(private readonly postService?: PostService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken: AccessTokenData = request.access_token;
    const { postId, teamId } = request.query;
    let writer: User;

    if (postId) writer = await this.postService.findWriterByIdOrFail(postId);
    if (teamId)
      writer = await this.postService.findWriterByTeamIdOrFail(teamId);

    if (writer.id !== accessToken.sub)
      throw new ForbiddenException('작성자가 아닙니다.');
    return true;
  }
}

import { PostStatus } from '../../post/enum/post-status';
import { BadRequestException } from '@nestjs/common';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PostService } from '../../post/post.service';

@Injectable()
export class CheckPostStatusInterceptor implements NestInterceptor {
  constructor(private readonly postService: PostService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<boolean>> {
    const request = context.switchToHttp().getRequest();
    const { postId } = request.query;
    const post = await this.postService.findOneByIdOrFail(postId);
    if (post.status === PostStatus.CLOSED)
      throw new BadRequestException('참가 모집이 마감된 글입니다.');
    return next.handle();
  }
}

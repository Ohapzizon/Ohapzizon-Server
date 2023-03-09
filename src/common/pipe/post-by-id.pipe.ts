import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import Post from '../../entities/post.entity';
import { PostService } from '../../post/post.service';

@Injectable()
export class postByIdPipe implements PipeTransform<number, Promise<Post>> {
  constructor(private readonly postService: PostService) {}
  async transform(value: number, metadata: ArgumentMetadata): Promise<Post> {
    return this.postService.findOneByIdOrFail(value);
  }
}

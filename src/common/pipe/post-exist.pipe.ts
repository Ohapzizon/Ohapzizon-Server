import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { PostService } from '../../post/post.service';

@Injectable()
export class postExistPipe implements PipeTransform<number, Promise<number>> {
  constructor(private readonly postService: PostService) {}
  async transform(value: number, metadata: ArgumentMetadata): Promise<number> {
    const exist: boolean = await this.postService.isExistById(value);
    if (!exist)
      throw new NotFoundException('요청하신 자료를 찾을 수 없습니다.');
    return value;
  }
}

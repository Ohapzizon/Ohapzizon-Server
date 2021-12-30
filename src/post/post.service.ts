import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostDto } from './dto/post.dto';
import Post from '../entities/post.entity';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async posting({ title, contents, headCount, isDayAndNight }: PostDto) {
    const hour = new Date().getHours();
    isDayAndNight = await this.isDayCheck(hour);
    const post: Post = this.postRepository.create({
      title: title,
      contents: contents,
      headCount: headCount,
      isDayAndNight: isDayAndNight,
    });
    return await this.postRepository.save(post);
  }

  async isDayCheck(hour: number) {
    return 0 <= hour && hour <= 13;
  }
}

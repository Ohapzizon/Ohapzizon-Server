import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostDto } from './dto/post.dto';
import Post from '../entities/post.entity';
import { DayOrNight } from '../entities/day_or_night.enum';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async posting({ title, contents }: PostDto) {
    const isDayOrNight: DayOrNight = await this.isDayCheck();
    const date = new Date().toISOString().slice(0, 10);
    const post: Post = this.postRepository.create({
      title: title,
      contents: contents,
      isDayOrNight: isDayOrNight,
      createdAt: date,
    });
    return await this.postRepository.save(post);
  }

  async isDayCheck() {
    const hour = new Date().getHours();
    if (0 <= hour && hour <= 13) {
      return DayOrNight.DAY;
    } else return DayOrNight.NIGHT;
  }
}

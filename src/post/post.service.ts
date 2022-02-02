import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostDto } from './dto/post.dto';
import { OrganizationRepository } from '../organization/organization.repository';
import { FindPostDto } from './dto/findPost.dto';
import { getRepository } from 'typeorm';
import { DayOrNight } from './types/day-or-night.enum';
import Post from 'src/entities/post.entity';
import User from '../entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async posting(
    { title, contents, maxCount }: PostDto,
    user: User,
  ): Promise<void> {
    const isDayOrNight: DayOrNight = await this.isDayCheck();
    await this.postRepository.save({
      title: title,
      contents: contents,
      isDayOrNight: isDayOrNight,
      maxCount: maxCount,
      user: user,
    });
  }

  async isDayCheck() {
    const hour = new Date().getHours();
    if (0 <= hour && hour <= 13) {
      return DayOrNight.DAY;
    } else return DayOrNight.NIGHT;
  }

  async findAllPost() {
    return await this.postRepository.find({
      relations: ['user'],
    });
  }

  async getPeopleList(idx: number) {
    return await this.postRepository.getPeopleList(idx);
  }

  async findOnePost(idx: number) {
    return await this.postRepository.findOnePost(idx);
  }

  async update(idx: number, postDto: PostDto) {
    const { title, contents, maxCount } = postDto;

    await this.postRepository.findPost({
      where: { post_idx: idx },
    });
    await this.postRepository.update(
      { post_idx: idx },
      { title: title, contents: contents, maxCount: maxCount },
    );
  }

  async delete(idx: number): Promise<void> {
    await this.postRepository.findPost({
      where: { post_idx: idx },
    });
    await this.postRepository.delete({ post_idx: idx });
  }
}

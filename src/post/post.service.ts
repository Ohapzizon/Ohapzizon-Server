import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostDto } from './dto/post.dto';
import { OrganizationRepository } from '../organization/organization.repository';
import { FindPostDto } from './dto/findPost.dto';
import { getRepository } from 'typeorm';
import Organization from '../entities/organization.entity';
import { DayOrNight } from '../common/types/day-or-night.enum';
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

  async findOnePost(idx: number) {
    const data = await this.organizationRepository.findOne(idx, {
      relations: ['user', 'post'],
    });
    const people_data = await this.getPeopleList(data.post.post_idx);
    const peopleList: string[] = [];

    people_data.forEach((value) => {
      peopleList.push(value.name);
    });
    const post = new FindPostDto();
    post.post = data.post;
    post.author = data.user.name;
    post.peopleList = peopleList;

    return post;
  }

  async getPeopleList(idx: number) {
    return getRepository(Organization)
      .createQueryBuilder('o')
      .select('u.name', 'name')
      .innerJoin('o.user', 'u')
      .where('o.organization_post = :id', { id: idx })
      .getRawMany();
  }

  async update(idx: number, postDto: PostDto) {
    const { title, contents, maxCount } = postDto;
    await this.postRepository.update(
      { post_idx: idx },
      { title: title, contents: contents, maxCount: maxCount },
    );
    return await this.postRepository.findOne(idx, {
      relations: ['user'],
    });
  }

  async delete(id: number): Promise<void> {
    const post: Post = await this.postRepository.findPost({
      where: id.toString(),
    });
    await this.postRepository.delete(post);
  }
}

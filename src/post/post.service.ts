import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostDto } from './dto/post.dto';
import Post from '../entities/post.entity';
import { OrganizationRepository } from '../organization/organization.repository';
import { FindPostDto } from './dto/findPost.dto';
import { getRepository } from 'typeorm';
import Organization from '../entities/organization.entity';
import { PostDto } from './dto/post.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly organizationRepository: OrganizationRepository,
  ) {}

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

  async findAllPost() {
    const data = await this.getPosts();
    let post = new FindPostDto();
    const result: FindPostDto[] = [];
    const name: string[] = [];

    data.forEach((value) => {
      post = value;
      value.peopleList.forEach((value) => {
        name.push(value);
      });
      post.peopleList = name;
      result.push(post);
    });
    return result;
  }

  async getPosts() {
    return getRepository(Organization)
      .createQueryBuilder('o')
      .select(
        'post_idx, post_title, post_contents, is_day_and_night, created_at, max_count, u.name "peopleList", pu.name "author"',
      )
      .innerJoin('o.post', 'p')
      .innerJoin('o.user', 'u')
      .innerJoin('p.user', 'pu')
      .getRawMany();
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
}

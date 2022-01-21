import {
  EntityRepository,
  FindOneOptions,
  getRepository,
  Repository,
} from 'typeorm';
import Post from '../entities/post.entity';
import { NotFoundException } from '@nestjs/common';
import Organization from '../entities/organization.entity';
import { PostDto } from './dto/post.dto';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async findPost(where: FindOneOptions<Post>): Promise<Post> {
    const post = await this.findOne(where);
    if (!post) {
      throw new NotFoundException(`해당하는 게시글이 존재하지않습니다.`);
    }
    return post;
  }

  async updatePost(idx: number, postDto: PostDto) {
    const post = await this.findOne(idx);
    if (!post) {
      throw new NotFoundException(
        `There isn't any user with identifier: ${idx}`,
      );
    }
    const { title, contents, maxCount } = postDto;
    await this.update(
      { post_idx: idx },
      { title: title, contents: contents, maxCount: maxCount },
    );
  }

  async getPeopleList(idx: number) {
    const peopleList: string[] = await getRepository(Organization)
      .createQueryBuilder('o')
      .select('u.name', 'name')
      .innerJoin('o.user', 'u')
      .where('o.organization_post = :id', { id: idx })
      .getRawMany();
    if (!peopleList) {
      throw new NotFoundException(
        `There isn't any user with identifier: ${idx}`,
      );
    }
    return peopleList;
  }

  async deletePost(idx: number) {
    const post: Post = await this.findOne(idx);
    if (!post) {
      throw new NotFoundException(
        `There isn't any user with identifier: ${idx}`,
      );
    }
    await this.delete(post);
  }

  async findOnePost(idx: number) {
    const post = await getRepository(Post)
      .createQueryBuilder('p')
      .select(
        'p.post_idx, p.title, p.contents, p.isDayOrNight, p.createdAt, p.maxCount, u.name "author"',
      )
      .innerJoin('p.user', 'u')
      .where('p.post_idx = :id', { id: idx })
      .execute();
    return post;
  }
}

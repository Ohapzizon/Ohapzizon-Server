import {
  EntityRepository,
  FindOneOptions,
  getRepository,
  Repository,
} from 'typeorm';
import Post from '../entities/post.entity';
import { NotFoundException } from '@nestjs/common';
import Organization from '../entities/organization.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async findPost(where: FindOneOptions<Post>): Promise<Post> {
    const post = await this.findOne(where);
    if (!post) {
      throw new NotFoundException(`해당하는 게시글이 존재하지않습니다.`);
    }
    return post;
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

  async findOnePost(idx: number) {
    return await getRepository(Post)
      .createQueryBuilder('p')
      .select(
        'p.post_idx, p.title, p.contents, p.isDayOrNight, p.createdAt, p.maxCount, u.name "author"',
      )
      .innerJoin('p.user', 'u')
      .where('p.post_idx = :id', { id: idx })
      .execute();
  }
}

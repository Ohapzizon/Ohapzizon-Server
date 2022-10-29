import dataSource from '../config/database/data-source';
import Post from '../entities/post.entity';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { isExistQuery } from '../common/row-query/is-exists';

export const postRepository = dataSource.getRepository(Post).extend({
  async findOneByIdOrFail(postId: number): Promise<Post> {
    return this.createQueryBuilder('p')
      .where('p.id = :id', { id: postId })
      .innerJoinAndSelect('p.writer', 'w')
      .innerJoinAndSelect('w.profile', 'writerProfile')
      .getOneOrFail();
  },

  findShowPost(): SelectQueryBuilder<Post> {
    return this.createQueryBuilder('p')
      .select([
        'p.id "postId"',
        'p.title "title"',
        'p.contents "contents"',
        'p.limit "limit"',
        'p.targetGrade "targetGrade"',
        'p.reserveDateTime "reserveDateTime"',
        'writerProfile.displayName "writer"',
      ])
      .innerJoin('p.writer', 'w')
      .innerJoin('w.profile', 'writerProfile');
  },

  async isExistById(postId: number): Promise<boolean> {
    return isExistQuery(
      postRepository
        .createQueryBuilder('p')
        .select('p.id', 'id')
        .where('p.id = ?')
        .getQuery(),
      [`${postId}`],
    );
  },
});

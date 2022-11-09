import dataSource from '../config/database/data-source';
import Post from '../entities/post.entity';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

export const postRepository = dataSource.getRepository(Post).extend({
  async findOneByIdOrFail(postId: number): Promise<Post> {
    return postRepository
      .createQueryBuilder('post')
      .where('post.id = :id', { id: postId })
      .getOneOrFail();
  },

  findWriter(): SelectQueryBuilder<Post> {
    return postRepository
      .createQueryBuilder('post')
      .select('writer.*')
      .innerJoin('post.writer', 'writer');
  },

  findShowPost(): SelectQueryBuilder<Post> {
    return postRepository
      .createQueryBuilder('post')
      .select([
        'post.id "postId"',
        'post.title "title"',
        'post.contents "contents"',
        'post.limit "limit"',
        'post.status "status"',
        'post.targetGrade "targetGrade"',
        'post.reserveDateTime "reserveDateTime"',
        'post.createdAt "createdAt"',
        'post.updatedAt "updatedAt"',
        'writerProfile.displayName "writer"',
      ])
      .innerJoin('post.writer', 'writer')
      .innerJoin('writer.profile', 'writerProfile');
  },
});

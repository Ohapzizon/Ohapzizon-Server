import { EntityRepository, FindOneOptions, Repository } from 'typeorm';
import Post from '../entities/post.entity';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async findPost(where: FindOneOptions<Post>): Promise<Post> {
    const post = await this.findOne(where);
    if (!post) {
      throw new NotFoundException(
        `There isn't any user with identifier: ${where}`,
      );
    }
    return post;
  }
}

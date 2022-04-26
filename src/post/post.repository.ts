import { EntityRepository, Repository } from 'typeorm';
import Post from '../entities/post.entity';
import { PostDto } from './dto/post.dto';
import { plainToClass } from 'class-transformer';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async findPostByIdx(idx: number): Promise<PostDto> {
    const raw = await this.createQueryBuilder('p')
      .where('p.post_idx = :idx', { idx: idx })
      .getOneOrFail()
      .catch((err) => {
        throw new NotFoundException(err);
      });
    return plainToClass(PostDto, raw);
  }

  async findAllPost(): Promise<PostDto[]> {
    const raw = await this.createQueryBuilder().getRawMany();
    return plainToClass(PostDto, raw);
  }
}

import {
  EntityRepository,
  getRepository,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import Post from '../entities/post.entity';
import { PostDto } from './dto/post.dto';
import { plainToClass } from 'class-transformer';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async findAllPost(): Promise<PostDto[]> {
    const row = await this.findPost().getRawMany();
    return plainToClass(PostDto, row);
  }

  async findOnePostByIdx(idx: number): Promise<PostDto> {
    const row = await this.findPost()
      .where('p.post_idx = :idx', { idx: idx })
      .getRawOne();
    return plainToClass(PostDto, row);
  }

  private findPost(): SelectQueryBuilder<Post> {
    return getRepository(Post).createQueryBuilder('p').select('*');
  }
}

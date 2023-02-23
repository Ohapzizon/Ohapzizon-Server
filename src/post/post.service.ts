import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import Post from '../entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { ShowPostDto } from './dto/show-post.dto';
import { PostStatus } from './enum/post-status';
import { Repository } from 'typeorm';
import { POST_REPOSITORY } from '../common/constants';

@Injectable()
export class PostService {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: Repository<Post>,
  ) {}

  async posting(
    userId: number,
    createPostDto: CreatePostDto,
  ): Promise<ShowPostDto> {
    const post: Post = this.postRepository.create({
      title: createPostDto.title,
      contents: createPostDto.contents,
      limit: createPostDto.limit,
      targetGrade: createPostDto.targetGrade,
      reserveDateTime: createPostDto.reserveDateTime,
      writerId: userId,
    });
    const savedPost: Post = await this.postRepository.save(post);
    return this.findShowPostDtoByIdOrFail(savedPost.id);
  }

  async findOneByIdOrFail(postId: number): Promise<Post> {
    return this.postRepository.findOneOrFail({
      where: { id: postId },
      cache: true,
    });
  }

  async findPostStatusByIdOrFail(postId: number): Promise<PostStatus> {
    const { status }: Post = await this.postRepository.findOneOrFail({
      select: { status: true },
      where: { id: postId },
      cache: true,
    });
    return status;
  }

  async findWriterIdByIdOrFail(postId: number): Promise<number> {
    const { writerId }: Post = await this.postRepository.findOneOrFail({
      select: { writerId: true },
      where: { id: postId },
    });
    return writerId;
  }

  async findShowPostDtoByIdOrFail(postId: number): Promise<ShowPostDto> {
    const post: Post = await this.postRepository.findOneOrFail({
      relations: {
        writer: true,
      },
      where: { id: postId },
      loadEagerRelations: true,
      loadRelationIds: false,
      relationLoadStrategy: 'query',
    });
    return new ShowPostDto(post);
  }

  async findAll(): Promise<ShowPostDto[]> {
    const posts: Post[] = await this.postRepository.find({
      relations: {
        writer: true,
      },
      loadEagerRelations: true,
      loadRelationIds: false,
      relationLoadStrategy: 'query',
      cache: true,
    });
    return posts.map((post) => new ShowPostDto(post));
  }

  async findMyJoinedPost(userId: number): Promise<ShowPostDto[]> {
    const posts: Post[] = await this.postRepository.find({
      where: { team: { userId: userId } },
      relations: { team: true },
    });
    return posts.map((post) => new ShowPostDto(post));
  }

  async updatePost(post: Post, updatePostDto: UpdatePostDto): Promise<void> {
    await this.postRepository.update({ id: post.id }, updatePostDto);
  }

  async closePost(post: Post): Promise<void> {
    await this.postRepository.update(
      { id: post.id },
      { status: PostStatus.CLOSED },
    );
  }

  async deletePost(post: Post): Promise<void> {
    await this.postRepository.delete({ id: post.id });
  }
}

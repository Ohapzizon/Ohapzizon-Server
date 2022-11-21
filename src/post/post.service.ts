import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import Post from '../entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { ShowPostDto } from './dto/show-post.dto';
import { PostStatus } from './enum/post-status';
import User from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @Inject('POST_REPOSITORY')
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

  async findShowPostDtoByIdOrFail(postId: number): Promise<ShowPostDto> {
    const post: Post = await this.postRepository.findOneOrFail({
      relations: {
        writer: {
          profile: {
            displayName: true,
          },
        },
      },
      where: { id: postId },
      loadRelationIds: false,
    });
    return new ShowPostDto(post);
  }

  async findMyJoinedPost(userId: number): Promise<ShowPostDto[]> {
    const posts = await this.postRepository.find({
      where: { team: { user: { id: userId } } },
    });
    return posts.map((post) => new ShowPostDto(post));
  }

  async findAll(): Promise<ShowPostDto[]> {
    const posts: Post[] = await this.postRepository.find({
      relations: {
        writer: {
          profile: {
            displayName: true,
          },
        },
      },
      loadRelationIds: false,
    });
    return posts.map((post) => new ShowPostDto(post));
  }

  async findWriterIdByIdFail(postId: number): Promise<User> {
    const { writer } = await this.postRepository.findOneOrFail({
      select: {
        writerId: true,
      },
      where: { id: postId },
    });
    return writer;
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

import { ForbiddenException, Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import Post from '../entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { UserService } from '../user/user.service';
import User from '../entities/user.entity';
import { ShowPostDto } from './dto/show-post.dto';
import { ShowPostDtoBuilder } from './builder/show-post-dto.builder';
import { Role } from '../user/enum/role';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userService: UserService,
  ) {}

  async findByPostIdx(postIdx: number): Promise<Post> {
    return await this.postRepository.findOneOrFail({
      idx: postIdx,
    });
  }

  async findShowPostDtoByPostIdx(postIdx: number): Promise<ShowPostDto> {
    const post: Post = await this.findByPostIdx(postIdx);
    return new ShowPostDtoBuilder()
      .setIdx(post.idx)
      .setTitle(post.title)
      .setContents(post.contents)
      .setMaxCount(post.maxCount)
      .setMealTime(post.mealTime)
      .setWriter(post.writer.name)
      .build();
  }

  async findAllShowPostDto(): Promise<ShowPostDto[]> {
    const post: Post[] = await this.postRepository.find();
    return post.map((post) =>
      new ShowPostDtoBuilder()
        .setIdx(post.idx)
        .setTitle(post.title)
        .setContents(post.contents)
        .setMaxCount(post.maxCount)
        .setMealTime(post.mealTime)
        .setWriter(post.writer.name)
        .build(),
    );
  }

  async posting(
    currentUserId: string,
    createPostDto: CreatePostDto,
  ): Promise<ShowPostDto> {
    const currentUser: User = await this.userService.findByUserId(
      currentUserId,
    );
    const post: Post = this.postRepository.create({
      title: createPostDto.title,
      contents: createPostDto.contents,
      maxCount: createPostDto.maxCount,
      writer: currentUser,
    });
    const savedPost: Post = await this.postRepository.save(post);
    return this.findShowPostDtoByPostIdx(savedPost.idx);
  }

  async updatePost(
    postIdx: number,
    currentUserId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<void> {
    const post: Post = await this.findByPostIdx(postIdx);
    const currentUser: User = await this.userService.findByUserId(
      currentUserId,
    );
    if (JSON.stringify(post.writer) !== JSON.stringify(currentUser)) {
      if (currentUser.role == Role.ADMIN) return;
      throw new ForbiddenException('게시글을 수정할 권한이 없습니다.');
    }
    await this.postRepository.update({ idx: post.idx }, updatePostDto);
  }

  async deletePost(postIdx: number, currentUserId: string): Promise<void> {
    const post: Post = await this.findByPostIdx(postIdx);
    const currentUser: User = await this.userService.findByUserId(
      currentUserId,
    );
    if (JSON.stringify(post.writer) !== JSON.stringify(currentUser)) {
      if (currentUser.role == Role.ADMIN) return;
      throw new ForbiddenException('게시글을 삭제할 권한이 없습니다.');
    }
    await this.postRepository.delete({ idx: post.idx });
  }
}

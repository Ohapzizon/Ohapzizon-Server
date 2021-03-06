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
    userId: number,
    createPostDto: CreatePostDto,
  ): Promise<ShowPostDto> {
    const currentUser: User = await this.userService.findOrFailByUserId(userId);
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
    userId: number,
    updatePostDto: UpdatePostDto,
  ): Promise<void> {
    const post: Post = await this.findByPostIdx(postIdx);
    const currentUser: User = await this.userService.findOrFailByUserId(userId);
    if (JSON.stringify(post.writer) !== JSON.stringify(currentUser)) {
      if (currentUser.role == Role.ADMIN) return;
      throw new ForbiddenException('???????????? ????????? ????????? ????????????.');
    }
    await this.postRepository.update({ idx: post.idx }, updatePostDto);
  }

  async deletePost(postIdx: number, userId: number): Promise<void> {
    const post: Post = await this.findByPostIdx(postIdx);
    const currentUser: User = await this.userService.findOrFailByUserId(userId);
    if (JSON.stringify(post.writer) !== JSON.stringify(currentUser)) {
      if (currentUser.role == Role.ADMIN) return;
      throw new ForbiddenException('???????????? ????????? ????????? ????????????.');
    }
    await this.postRepository.delete({ idx: post.idx });
  }
}

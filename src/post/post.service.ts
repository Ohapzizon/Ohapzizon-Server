import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import Post from '../entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { ShowPostDto } from './dto/show-post.dto';
import { postRepository } from './post.repository';
import { PostStatus } from './enum/post-status';
import { plainToInstance } from 'class-transformer';
import User from '../entities/user.entity';

@Injectable()
export class PostService {
  async findOneByIdOrFail(postId: number): Promise<Post> {
    return postRepository.findOneByIdOrFail(postId);
  }

  async findMyJoinedPost(userId: number): Promise<ShowPostDto[]> {
    return postRepository
      .findShowPost()
      .innerJoin('post.team', 'team')
      .innerJoin('team.user', 'participants')
      .where('participants.id = :id', { id: userId })
      .getRawMany();
  }

  async findWriterByIdOrFail(postId: number): Promise<User> {
    const row = await postRepository
      .findWriter()
      .where('post.id = :id', { id: postId })
      .getRawOne();
    if (!row) throw new NotFoundException('요청하신 자료를 찾을 수 없습니다.');
    return plainToInstance(User, row);
  }

  async findWriterByTeamIdOrFail(teamId: number) {
    const row = await postRepository
      .findWriter()
      .where('team.id = :id', { id: teamId })
      .innerJoin('post.team', 'team')
      .getRawOne();
    if (!row) throw new NotFoundException('요청하신 자료를 찾을 수 없습니다.');
    return plainToInstance(User, row);
  }

  async findShowPostDtoByIdOrFail(postId: number): Promise<ShowPostDto> {
    const row = await postRepository
      .findShowPost()
      .where('post.id = :id', { id: postId })
      .getRawOne();
    if (!row) throw new NotFoundException('요청하신 자료를 찾을 수 없습니다.');
    return plainToInstance(ShowPostDto, row);
  }

  async findAll(): Promise<ShowPostDto[]> {
    const row = await postRepository.findShowPost().getRawMany();
    return plainToInstance(ShowPostDto, row);
  }

  async posting(
    userId: number,
    createPostDto: CreatePostDto,
  ): Promise<ShowPostDto> {
    const post: Post = postRepository.create({
      title: createPostDto.title,
      contents: createPostDto.contents,
      limit: createPostDto.limit,
      targetGrade: createPostDto.targetGrade,
      reserveDateTime: createPostDto.reserveDateTime,
      writer: { id: userId },
    });
    const savedPost: Post = await postRepository.save(post);
    return this.findShowPostDtoByIdOrFail(savedPost.id);
  }

  async updatePost(post: Post, updatePostDto: UpdatePostDto): Promise<void> {
    await postRepository.update({ id: post.id }, updatePostDto);
  }

  async closePost(post: Post): Promise<void> {
    await postRepository.update({ id: post.id }, { status: PostStatus.CLOSED });
  }

  async deletePost(post: Post): Promise<void> {
    await postRepository.delete({ id: post.id });
  }
}

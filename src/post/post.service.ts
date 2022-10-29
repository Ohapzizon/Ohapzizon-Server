import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import Post from '../entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import * as _ from 'lodash';
import { ShowPostDto } from './dto/show-post.dto';
import { postRepository } from './post.repository';

@Injectable()
export class PostService {
  async findOneByIdOrFail(postId: number): Promise<Post> {
    return postRepository.findOneByIdOrFail(postId);
  }

  async findShowPostDtoByIdOrFail(postId: number): Promise<ShowPostDto> {
    const post = await postRepository
      .findShowPost()
      .where('p.id = :id', { id: postId })
      .getRawOne<ShowPostDto>();
    if (!post) throw new NotFoundException('요청하신 자료를 찾을 수 없습니다.');
    return post;
  }

  async isExistById(postId: number): Promise<boolean> {
    return postRepository.isExistById(postId);
  }

  async findAll(): Promise<ShowPostDto[]> {
    return postRepository.findShowPost().getRawMany<ShowPostDto>();
  }

  async posting(
    userId: string,
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

  async updatePost(
    postId: number,
    userId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<void> {
    const post: Post = await this.findOneByIdOrFail(postId);
    if (!_.isEqual(post.writer.id, userId))
      throw new ForbiddenException('게시글을 수정할 권한이 없습니다.');
    await postRepository.update({ id: post.id }, updatePostDto);
  }

  async deletePost(postId: number, userId: string): Promise<void> {
    const post: Post = await this.findOneByIdOrFail(postId);
    if (!_.isEqual(post.writer.id, userId))
      throw new ForbiddenException('게시글을 수정할 권한이 없습니다.');
    await postRepository.delete({ id: post.id });
  }
}

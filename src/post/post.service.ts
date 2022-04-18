import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PostRepository } from './post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { DayOrNight } from './types/day-or-night.enum';
import User from '../entities/user.entity';
import Post from '../entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { isDayCheck } from '../common/utills/day-check';
import { PostDto } from './dto/post.dto';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async posting(postDto: CreatePostDto, user: User): Promise<PostDto> {
    const { title, contents, maxCount } = postDto;
    const isDayOrNight: DayOrNight = isDayCheck(new Date().getHours());
    const post: Post = this.postRepository.create({
      title: title,
      contents: contents,
      maxCount: maxCount,
      isDayOrNight: isDayOrNight,
      writer: user.name,
    });
    await this.postRepository.save(post);
    return this.findExistingPostByIdx(post.postIdx);
  }

  findAllPost(): Promise<PostDto[]> {
    return this.postRepository.findAllPost();
  }

  async findExistingPostByIdx(idx: number): Promise<PostDto> {
    const post: PostDto = await this.postRepository.findOnePostByIdx(idx);
    if (!post)
      throw new NotFoundException('해당하는 게시글이 존재하지 않습니다.');
    return post;
  }

  async updatePost(
    idx: number,
    updatePostDto: UpdatePostDto,
    user: User,
  ): Promise<PostDto> {
    const post: PostDto = await this.findExistingPostByIdx(idx);
    if (post.writer !== user.name)
      throw new UnauthorizedException('게시글을 수정할 권한이 없습니다.');
    await this.postRepository.update({ postIdx: post.postIdx }, updatePostDto);
    return this.findExistingPostByIdx(idx);
  }

  async deletePost(idx: number, user: User): Promise<void> {
    const post: PostDto = await this.findExistingPostByIdx(idx);
    if (post.writer !== user.name)
      throw new UnauthorizedException('게시글을 삭제할 권한이 없습니다.');
    await this.postRepository.delete({ postIdx: post.postIdx });
  }
}

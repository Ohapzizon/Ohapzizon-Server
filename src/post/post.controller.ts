import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDecorator } from '../common/decorators/user.decorator';
import BaseResponse from '../common/response/base.response';
import { FindOnePostResponse } from './response/find-one-post.response';
import { FindAllPostResponse } from './response/find-all-post.response';
import { Auth } from '../common/decorators/auth.decorator';
import { Role } from '../user/enum/role';
import { UpdatePostDto } from './dto/update-post.dto';
import { ShowPostDto } from './dto/show-post.dto';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: '모집글 게시' })
  @Auth(Role.USER)
  @HttpCode(HttpStatus.CREATED)
  @Post('')
  async posting(
    @UserDecorator('userId', ParseIntPipe) userId: number,
    @Body() createPostDto: CreatePostDto,
  ): Promise<FindOnePostResponse> {
    const data: ShowPostDto = await this.postService.posting(
      userId,
      createPostDto,
    );
    return new FindOnePostResponse(
      HttpStatus.CREATED,
      '게시글 게시에 성공하였습니다.',
      data,
    );
  }

  @ApiOperation({ summary: '모집글 상세조회' })
  @Get(':postIdx')
  async findOnePost(
    @Param('postIdx', ParseIntPipe) postIdx: number,
  ): Promise<FindOnePostResponse> {
    const data: ShowPostDto = await this.postService.findShowPostDtoByPostIdx(
      postIdx,
    );
    return new FindOnePostResponse(
      HttpStatus.OK,
      '게시글 상세조회에 성공하였습니다.',
      data,
    );
  }

  @ApiOperation({ summary: '모집글 전체 조회' })
  @Get('')
  async findAll(): Promise<FindAllPostResponse> {
    const data: ShowPostDto[] = await this.postService.findAllShowPostDto();
    return new FindAllPostResponse(
      HttpStatus.OK,
      '게시글 전체조회에 성공하였습니다.',
      data,
    );
  }

  @ApiOperation({ summary: '모집글 수정' })
  @HttpCode(HttpStatus.OK)
  @Auth(Role.USER)
  @Put(':postIdx')
  async updatePost(
    @Param('postIdx', ParseIntPipe) postIdx: number,
    @UserDecorator('userId', ParseIntPipe) userId: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<BaseResponse<void>> {
    await this.postService.updatePost(postIdx, userId, updatePostDto);
    return new BaseResponse<void>(
      HttpStatus.OK,
      '모집글 수정에 성공하였습니다.',
    );
  }

  @ApiOperation({ summary: '모집글 삭제' })
  @Auth(Role.USER)
  @Delete(':postIdx')
  async deletePost(
    @Param('postIdx', ParseIntPipe) postIdx: number,
    @UserDecorator('userId', ParseIntPipe) userId: number,
  ): Promise<BaseResponse<void>> {
    await this.postService.deletePost(postIdx, userId);
    return new BaseResponse<void>(
      HttpStatus.OK,
      '모집글 삭제에 성공하였습니다.',
    );
  }
}

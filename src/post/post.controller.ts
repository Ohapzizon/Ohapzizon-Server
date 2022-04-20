import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Put,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserDecorator } from '../common/decorators/user.decorator';
import User from '../entities/user.entity';
import BaseResponse from '../common/response/base.response';
import { FindAllPostResDto, FindOnePostResDto, PostDto } from './dto/post.dto';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '모집글 게시' })
  @ApiBadRequestResponse({ description: '올바르지 않은 정보입니다.' })
  @HttpCode(HttpStatus.CREATED)
  @Post('')
  async posting(
    @Body() postDto: CreatePostDto,
    @UserDecorator() user: User,
  ): Promise<FindOnePostResDto> {
    const data: PostDto = await this.postService.posting(postDto, user);
    return new FindOnePostResDto(
      HttpStatus.OK,
      '게시글 게시에 성공하였습니다.',
      data,
    );
  }

  @ApiOperation({ summary: '모집글 전체 조회' })
  @HttpCode(HttpStatus.OK)
  @Get('')
  async findAllPost(): Promise<FindAllPostResDto> {
    const data: PostDto[] = await this.postService.findAllPost();
    return new FindAllPostResDto(
      200,
      '게시글 전체조회에 성공하였습니다.',
      data,
    );
  }

  @ApiOperation({ summary: '모집글 상세조회' })
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'idx',
    required: true,
    description: '불러올 게시글의 idx',
  })
  @Get(':idx')
  async findOnePost(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<FindOnePostResDto> {
    const data: PostDto = await this.postService.findExistingPostByIdx(idx);
    return new FindOnePostResDto(
      200,
      '게시글 상세조회에 성공하였습니다.',
      data,
    );
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'idx',
    required: true,
    description: '수정할 게시글',
  })
  @ApiOperation({ summary: '모집글 수정' })
  @HttpCode(HttpStatus.OK)
  @Put(':idx')
  async update(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() createPostDto: CreatePostDto,
    @UserDecorator() user: User,
  ): Promise<FindOnePostResDto> {
    const data: PostDto = await this.postService.updatePost(
      idx,
      createPostDto,
      user,
    );
    return new FindOnePostResDto(200, '모집글 수정에 성공하였습니다.', data);
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'idx',
    required: true,
    description: '삭제할 게시글',
  })
  @ApiOperation({ summary: '모집글 삭제' })
  @Delete(':idx')
  async delete(
    @Param('idx', ParseIntPipe) idx: number,
    @UserDecorator() user: User,
  ): Promise<BaseResponse<void>> {
    await this.postService.deletePost(idx, user);
    return new BaseResponse<void>(200, '모집글 삭제에 성공하였습니다.');
  }
}

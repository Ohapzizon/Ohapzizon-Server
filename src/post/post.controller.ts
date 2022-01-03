import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto } from './dto/post.dto';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Post')
@Controller('/api/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: '모집글 게시' })
  @ApiBadRequestResponse({ description: '올바르지 않은 정보입니다.' })
  @HttpCode(HttpStatus.CREATED)
  @Post('/recruitment')
  async post(@Body() postDto: PostDto) {
    const data = await this.postService.posting(postDto);
    return {
      status: 200,
      message: '모집글을 게시하였습니다.',
      data,
    };
  }

  @ApiOperation({ summary: '게시글 조회' })
  @HttpCode(HttpStatus.OK)
  @Get('/recruitment')
  async findAllPost() {
    const data = await this.postService.findAllPost();
    return {
      status: 200,
      message: '게시글 조회에 성공하였습니다.',
      data,
    };
  }

  @ApiParam({
    name: 'id',
    required: true,
    description: '불러올 게시글',
  })
  @ApiOperation({ summary: '게시글 상세조회' })
  @ApiResponse({
    description: '성공',
  })
  @HttpCode(HttpStatus.OK)
  @Get('/recruitment/:id')
  async findOnePost(@Param('id') id) {
    const data = await this.postService.findOnePost(id);
    return {
      status: 200,
      message: '게시글 상세조회에 성공하였습니다.',
      data,
    };
  }

  @ApiParam({
    name: 'id',
    required: true,
    description: '수정할 게시글',
  })
  @ApiOperation({ summary: '모집글 수정' })
  @ApiResponse({
    description: '성공',
    type: PostDto,
  })
  @ApiBadRequestResponse({ description: '올바르지 않은 정보입니다.' })
  @HttpCode(HttpStatus.OK)
  @Put('/recruitment/update/:id')
  async update(@Param('id') id, @Body() postDto: PostDto) {
    const data = await this.postService.update(id, postDto);
    return {
      status: 200,
      message: '모집글을 수정하였습니다.',
      data,
    };
  }
}

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto } from './dto/post.dto';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Post')
@Controller('/api/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: '모집글 게시' })
  @ApiResponse({
    description: '성공',
    type: PostDto,
  })
  @ApiBadRequestResponse({ description: '올바르지 않은 정보입니다.' })
  @HttpCode(HttpStatus.CREATED)
  @Post('/recruit/recruitment')
  async post(@Body() postDto: PostDto) {
    const data = await this.postService.posting(postDto);
    return {
      status: 200,
      message: '모집글을 게시하였습니다.',
      data,
    };
  }
}

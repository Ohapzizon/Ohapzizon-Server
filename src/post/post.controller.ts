import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto } from './dto/post.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '모집글 게시' })
  @ApiResponse({
    description: '성공',
    type: PostDto,
  })
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

  @ApiOperation({ summary: '게시글 상세조회' })
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    required: true,
    description: '불러올 페이지',
  })
  @Get('/recruitment/:id')
  async findOnePost(@Param('id') id) {
    const data = await this.postService.findOnePost(id);
    return {
      status: 200,
      message: '게시글 상세조회에 성공하였습니다.',
      data,
    };
  }
}

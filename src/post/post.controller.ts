import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto } from './dto/post.dto';
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

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '모집글 게시' })
  @ApiBadRequestResponse({ description: '올바르지 않은 정보입니다.' })
  @HttpCode(HttpStatus.CREATED)
  @Post('/recruitment')
  async post(@Body() postDto: PostDto, @UserDecorator() user: User) {
    await this.postService.posting(postDto, user);
    return {
      status: 200,
      message: '모집글을 게시하였습니다.',
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
    description: '불러올 게시글',
  })
  @Get('/recruitment/:id')
  async findOnePost(@Param('id', ParseIntPipe) id: number) {
    const data = await this.postService.findOnePost(id);
    return {
      status: 200,
      message: '게시글 상세조회에 성공하였습니다.',
      data,
    };
  }

  @ApiOperation({ summary: '신청 목록 조회' })
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'idx',
    required: true,
    description: '신청 목록',
  })
  @Get('/recruitment/people-list/:idx')
  async getPeopleList(@Param('idx') id) {
    const data = await this.postService.getPeopleList(id);
    return {
      status: 200,
      message: '신청 목록 조회에 성공하였습니다.',
      data,
    };
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'id',
    required: true,
    description: '수정할 게시글',
  })
  @ApiOperation({ summary: '모집글 수정' })
  @HttpCode(HttpStatus.OK)
  @Put('/recruitment/update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() postDto: PostDto,
  ) {
    const data = await this.postService.update(id, postDto);
    return {
      status: 200,
      message: '모집글을 수정하였습니다.',
      data,
    };
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'id',
    required: true,
    description: '삭제할 게시글',
  })
  @ApiOperation({ summary: '모집글 삭제' })
  @Delete('/recruitment/delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.postService.delete(id);
    return {
      status: 200,
      message: '모집글을 삭제하였습니다.',
    };
  }
}

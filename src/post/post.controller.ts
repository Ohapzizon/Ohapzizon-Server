import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { AccessToken } from '../common/decorators/token.decorator';
import { Auth } from '../common/decorators/auth.decorator';
import { UpdatePostDto } from './dto/update-post.dto';
import { ResponseEntity } from '../common/response/response.entity';
import { ShowPostDto } from './dto/show-post.dto';
import { CreatePostResponse } from './res/create-post.response';
import { FindPostResponse } from './res/find-post.response';
import { FindAllPostResponse } from './res/find-all-post.response';
import { UpdatePostResponse } from './res/update-post.response';
import { DeletePostResponse } from './res/delete-post.response';
import { NotFoundError } from '../common/response/swagger/error/not-found.error';
import { InternalServerError } from '../common/response/swagger/error/internal-server.error';
import { ClosePostResponse } from './res/close-post.response';
import { WriterGuard } from './guard/writer.guard';
import { postByIdPipe } from './pipe/post-by-id.pipe';
import PostEntity from '../entities/post.entity';
import { GROUP_ALL_POSTS, GROUP_POST } from './enum/group-post';

@ApiInternalServerErrorResponse({
  description: '서버 에러입니다.',
  type: InternalServerError,
})
@ApiTags('post')
@SerializeOptions({
  groups: [GROUP_POST],
})
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: '모집글 게시' })
  @ApiCreatedResponse({
    description: '모집글 게시에 성공하였습니다.',
    type: CreatePostResponse,
  })
  @Auth()
  @HttpCode(201)
  @Post('')
  async posting(
    @AccessToken('sub') userId: string,
    @Body() createPostDto: CreatePostDto,
  ): Promise<ResponseEntity<ShowPostDto>> {
    const data: ShowPostDto = await this.postService.posting(
      userId,
      createPostDto,
    );
    return ResponseEntity.CREATED_WITH_DATA(
      '모집글 게시에 성공하였습니다.',
      data,
    );
  }

  @ApiOperation({ summary: '모집글 상세조회' })
  @ApiOkResponse({
    description: '모집글 상세조회에 성공하였습니다.',
    type: FindPostResponse,
  })
  @ApiNotFoundResponse({
    description: '요청하신 자료를 찾을 수 없습니다.',
    type: NotFoundError,
  })
  @Get(':postId')
  async findOnePost(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<ResponseEntity<ShowPostDto>> {
    const data: ShowPostDto = await this.postService.findShowPostDtoByIdOrFail(
      postId,
    );
    return ResponseEntity.OK_WITH_DATA(
      '모집글 상세조회에 성공하였습니다.',
      data,
    );
  }

  @ApiOperation({ summary: '모집글 전체 조회' })
  @ApiOkResponse({
    description: '모집글 전체조회에 성공하였습니다.',
    type: FindAllPostResponse,
  })
  @Get('')
  @SerializeOptions({
    groups: [GROUP_ALL_POSTS],
  })
  async findAll(): Promise<ResponseEntity<ShowPostDto[]>> {
    const data: ShowPostDto[] = await this.postService.findAll();
    return ResponseEntity.OK_WITH_DATA(
      '모집글 전체 조회에 성공하였습니다.',
      data,
    );
  }

  @ApiOperation({ summary: '모집글 수정' })
  @ApiOkResponse({
    description: '모집글 수정에 성공하였습니다.',
    type: UpdatePostResponse,
  })
  @ApiNotFoundResponse({
    description: '요청하신 자료를 찾을 수 없습니다.',
    type: NotFoundError,
  })
  @ApiQuery({ name: 'postId', required: true, type: Number })
  @UseGuards(WriterGuard)
  @Auth()
  @Put('')
  async updatePost(
    @Query('postId', ParseIntPipe, postByIdPipe) post: PostEntity,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<ResponseEntity<string>> {
    await this.postService.updatePost(post, updatePostDto);
    return ResponseEntity.OK_WITH('모집글 수정에 성공하였습니다.');
  }

  @ApiOperation({ summary: '모집글 마감' })
  @ApiOkResponse({
    description: '모집글 마감에 성공하였습니다.',
    type: ClosePostResponse,
  })
  @ApiNotFoundResponse({
    description: '요청하신 자료를 찾을 수 없습니다.',
    type: NotFoundError,
  })
  @ApiQuery({ name: 'postId', required: true, type: Number })
  @UseGuards(WriterGuard)
  @Auth()
  @Patch('close')
  async closedPost(
    @Query('postId', ParseIntPipe, postByIdPipe) post: PostEntity,
  ): Promise<ResponseEntity<string>> {
    await this.postService.closePost(post);
    return ResponseEntity.OK_WITH('모집글 마감에 성공하였습니다.');
  }

  @ApiOperation({ summary: '모집글 삭제' })
  @ApiOkResponse({
    description: '모집글 삭제에 성공하였습니다.',
    type: DeletePostResponse,
  })
  @ApiNotFoundResponse({
    description: '요청하신 자료를 찾을 수 없습니다.',
    type: NotFoundError,
  })
  @ApiQuery({ name: 'postId', required: false, type: Number })
  @UseGuards(WriterGuard)
  @Auth()
  @Delete('')
  async deletePost(
    @Query('postId', ParseIntPipe, postByIdPipe) post: PostEntity,
  ): Promise<ResponseEntity<string>> {
    await this.postService.deletePost(post);
    return ResponseEntity.OK_WITH('모집글 삭제에 성공하였습니다.');
  }
}

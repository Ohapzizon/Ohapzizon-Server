import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  SerializeOptions,
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
} from '@nestjs/swagger';
import { AccessToken } from '../common/decorators/token.decorator';
import { Auth } from '../common/decorators/auth.decorator';
import { Role } from '../user/enum/role';
import { UpdatePostDto } from './dto/update-post.dto';
import { ResponseEntity } from '../common/response/response.entity';
import { ShowPostDto } from './dto/show-post.dto';
import { GROUP_ALL_POSTS, GROUP_POST } from './enum/group-all-post';
import { CreatedPostResponse } from './res/created-post.response';
import { FindPostResponse } from './res/find-post.response';
import { FindAllPostResponse } from './res/find-all-post.response';
import { UpdatedPostResponse } from './res/updated-post.response';
import { DeletedPostResponse } from './res/deleted-post.response';
import { NotFoundError } from '../common/response/swagger/error/not-found.error';
import { InternalServerError } from '../common/response/swagger/error/internal-server.error';
import { postExistPipe } from '../common/pipe/post-exist.pipe';

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
    type: CreatedPostResponse,
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
    @Param('postId', postExistPipe) postId: number,
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
    type: UpdatedPostResponse,
  })
  @ApiNotFoundResponse({
    description: '요청하신 자료를 찾을 수 없습니다.',
    type: NotFoundError,
  })
  @Auth(Role.USER)
  @Put(':postId')
  async updatePost(
    @Param('postId', postExistPipe) postId: number,
    @AccessToken('sub') userId: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<ResponseEntity<string>> {
    await this.postService.updatePost(postId, userId, updatePostDto);
    return ResponseEntity.OK_WITH('모집글 수정에 성공하였습니다.');
  }

  @ApiOperation({ summary: '모집글 삭제' })
  @ApiOkResponse({
    description: '모집글 삭제에 성공하였습니다.',
    type: DeletedPostResponse,
  })
  @ApiNotFoundResponse({
    description: '요청하신 자료를 찾을 수 없습니다.',
    type: NotFoundError,
  })
  @Auth(Role.USER)
  @Delete(':postId')
  async deletePost(
    @Param('postId', postExistPipe) postId: number,
    @AccessToken('sub') userId: string,
  ): Promise<ResponseEntity<string>> {
    await this.postService.deletePost(postId, userId);
    return ResponseEntity.OK_WITH('모집글 삭제에 성공하였습니다.');
  }
}

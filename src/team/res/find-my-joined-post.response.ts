import { ResponseEntity } from '../../common/response/response.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ShowPostDto } from '../../post/dto/show-post.dto';
import { ResponseStatus } from '../../common/response/response.status';

export class FindMyJoinedPostResponse extends ResponseEntity<ShowPostDto[]> {
  @ApiProperty({
    example: ResponseStatus.OK,
  })
  get statusCode(): ResponseStatus {
    return super.statusCode;
  }

  @ApiProperty({
    example: '참여한 모집글 조회에 성공하였습니다.',
  })
  get message(): string {
    return super.message;
  }

  @ApiProperty({
    type: [ShowPostDto],
  })
  get data(): ShowPostDto[] {
    return super.data;
  }
}

import { ResponseEntity } from '../../common/response/response.entity';
import { ShowPostDto } from '../dto/show-post.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseStatus } from '../../common/response/response.status';

export class FindAllPostResponse extends ResponseEntity<ShowPostDto[]> {
  @ApiProperty({
    example: ResponseStatus.OK,
  })
  get statusCode(): ResponseStatus {
    return super.statusCode;
  }

  @ApiProperty({
    example: '모집글 전체조회에 성공하였습니다.',
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

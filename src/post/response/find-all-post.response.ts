import { ApiProperty } from '@nestjs/swagger';
import BaseResponse from '../../common/response/base.response';
import { ShowPostDto } from '../dto/show-post.dto';

export class FindAllPostResponse extends BaseResponse<ShowPostDto[]> {
  @ApiProperty({
    type: () => [ShowPostDto],
  })
  data!: ShowPostDto[];
}

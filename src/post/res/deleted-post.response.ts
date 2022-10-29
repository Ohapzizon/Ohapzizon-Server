import { ResponseEntity } from '../../common/response/response.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseStatus } from '../../common/response/response.status';

export class DeletedPostResponse extends ResponseEntity<string> {
  @ApiProperty({
    example: ResponseStatus.OK,
  })
  get statusCode(): ResponseStatus {
    return super.statusCode;
  }

  @ApiProperty({
    example: '모집글 삭제에 성공하였습니다.',
  })
  get message(): string {
    return super.message;
  }
}

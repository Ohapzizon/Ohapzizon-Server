import { ApiProperty } from '@nestjs/swagger';
import { ResponseEntity } from '../../../common/response/response.entity';
import { ResponseStatus } from '../../../common/response/response.status';

export class UpdateUserProfileResponse extends ResponseEntity<string> {
  @ApiProperty({
    example: ResponseStatus.OK,
  })
  get statusCode(): ResponseStatus {
    return super.statusCode;
  }

  @ApiProperty({
    example: '프로필 수정에 성공하였습니다.',
  })
  get message(): string {
    return super.message;
  }
}

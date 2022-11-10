import { ShowUserProfileDto } from '../dto/show-user-profile.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseEntity } from '../../../common/response/response.entity';
import { ResponseStatus } from '../../../common/response/response.status';

export class FindUserProfileResponse extends ResponseEntity<ShowUserProfileDto> {
  @ApiProperty({
    example: ResponseStatus.OK,
  })
  get statusCode(): ResponseStatus {
    return super.statusCode;
  }

  @ApiProperty({
    example: '프로필 조회에 성공하였습니다.',
  })
  get message(): string {
    return super.message;
  }

  @ApiProperty({
    type: ShowUserProfileDto,
  })
  get data(): ShowUserProfileDto {
    return super.data;
  }
}

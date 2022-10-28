import { ResponseEntity } from '../../common/response/response.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseStatus } from '../../common/response/response.status';
import { SocialProfileDto } from '../dto/social-profile.dto';

export class ProfileResponse extends ResponseEntity<SocialProfileDto> {
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
    type: SocialProfileDto,
  })
  get data(): SocialProfileDto {
    return super.data;
  }
}

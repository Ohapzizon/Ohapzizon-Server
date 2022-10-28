import { ResponseEntity } from '../../common/response/response.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseStatus } from '../../common/response/response.status';
import { ShowTeamDto } from '../dto/show-team.dto';

export class FindTeamResponse extends ResponseEntity<ShowTeamDto[]> {
  @ApiProperty({
    example: ResponseStatus.OK,
  })
  get statusCode(): ResponseStatus {
    return super.statusCode;
  }

  @ApiProperty({
    example: '신청자 명단 조회에 성공하였습니다.',
  })
  get message(): string {
    return super.message;
  }

  @ApiProperty({
    type: [ShowTeamDto],
  })
  get data(): ShowTeamDto[] {
    return super.data;
  }
}

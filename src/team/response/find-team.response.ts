import { ApiProperty } from '@nestjs/swagger';
import BaseResponse from '../../common/response/base.response';
import { ShowTeamDto } from '../dto/show-team.dto';

export class FindTeamResponse extends BaseResponse<ShowTeamDto[]> {
  @ApiProperty({
    type: () => [ShowTeamDto],
  })
  data!: ShowTeamDto[];
}

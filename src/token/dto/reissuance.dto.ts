import BaseResponse from '../../common/response/base.response';
import { ApiProperty } from '@nestjs/swagger';

export default class ReissuanceDto {
  token: string;
}

export class IReissuanceResponse extends BaseResponse<ReissuanceDto> {
  @ApiProperty({
    type: () => ReissuanceDto,
  })
  data: ReissuanceDto;
}

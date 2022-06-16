import BaseResponse from '../../common/response/base.response';
import { ApiProperty } from '@nestjs/swagger';
import { ReissuanceDto } from '../dto/reissuance.dto';

export class ReissuanceResponse extends BaseResponse<ReissuanceDto> {
  @ApiProperty({
    type: () => ReissuanceDto,
  })
  data!: ReissuanceDto;
}

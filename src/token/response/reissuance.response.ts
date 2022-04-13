import BaseResponse from '../../common/response/base.response';
import { ApiProperty } from '@nestjs/swagger';

export default class ReissuanceResponseData {
  token: string;

  constructor(token: string) {
    this.token = 'Bearer ' + token;
  }
}

export class ReissuanceResponse extends BaseResponse<ReissuanceResponseData> {
  @ApiProperty({
    type: () => ReissuanceResponseData,
  })
  data: ReissuanceResponseData;
}

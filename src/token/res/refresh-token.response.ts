import { ResponseEntity } from '../../common/response/response.entity';
import { TokenDto } from '../dto/token.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseStatus } from '../../common/response/response.status';

export class RefreshTokenResponse extends ResponseEntity<TokenDto> {
  @ApiProperty({
    example: ResponseStatus.OK,
  })
  get statusCode(): ResponseStatus {
    return super.statusCode;
  }

  @ApiProperty({
    example: '토큰 재발급에 성공하였습니다.',
  })
  get message(): string {
    return super.message;
  }

  @ApiProperty({
    type: TokenDto,
  })
  get data(): TokenDto {
    return super.data;
  }
}

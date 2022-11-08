import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { JoinStatus } from '../enum/join-status';

export class UpdateJoinStatusDto {
  @ApiProperty({
    name: 'joinStatus',
    description: '신청 상태',
    default: JoinStatus.ACCEPT,
  })
  @IsEnum(JoinStatus)
  joinStatus: JoinStatus;
}

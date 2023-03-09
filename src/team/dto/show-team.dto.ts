import { JoinStatus } from '../enum/join-status';
import { Exclude, Expose } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import Team from '../../entities/team.entity';

export class ShowTeamDto {
  @ApiHideProperty() @Exclude() private readonly _id: number;
  @ApiHideProperty() @Exclude() private readonly _participants: string;
  @ApiHideProperty() @Exclude() private readonly _status: JoinStatus;
  @ApiHideProperty() @Exclude() private readonly _bio: string;

  constructor(team: Team) {
    this._id = team.id;
    this._participants = team.user.profile.displayName;
    this._status = team.status;
    this._bio = team.bio;
  }

  @ApiProperty({
    name: 'teamId',
    example: 1,
  })
  @Expose()
  get teamId(): number {
    return this._id;
  }

  @ApiProperty({
    name: 'participants',
    description: '참가자 이름',
    example: '송유현',
  })
  @Expose({ name: '' })
  get participants(): string {
    return this._participants;
  }

  @ApiProperty({
    name: 'bio',
    description: '짧은 자기소개',
    example: '열심히 하겠습니다.',
  })
  @Expose()
  get bio(): string {
    return this._bio;
  }

  @ApiProperty({
    name: 'status',
    description: '상태',
    enum: JoinStatus,
    example: JoinStatus.ACCEPT,
  })
  @Expose()
  get status(): JoinStatus {
    return this._status;
  }
}

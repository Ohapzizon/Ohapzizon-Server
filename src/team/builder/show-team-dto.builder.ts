import { Builder } from '../../common/builder/builder';
import { IBuilder } from '../../common/builder/types/builder.type';
import { ShowTeamDto } from '../dto/show-team.dto';

export class ShowTeamDtoBuilder
  extends Builder<ShowTeamDto>
  implements IBuilder<ShowTeamDto>
{
  constructor() {
    super(ShowTeamDto);
  }

  setIdx(arg: ShowTeamDto['idx']) {
    this.object.idx = arg;
    return this;
  }

  setParticipants(arg: ShowTeamDto['participants']) {
    this.object.participants = arg;
    return this;
  }

  setStatus(arg: ShowTeamDto['status']) {
    this.object.status = arg;
    return this;
  }
}

import { Status } from '../enum/status';

export class ShowTeamDto {
  idx: number;
  status: Status;
  participants: string;
}

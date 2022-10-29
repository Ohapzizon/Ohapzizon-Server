import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { TeamService } from '../../team/team.service';

@Injectable()
export class teamExistPipe implements PipeTransform<number, Promise<number>> {
  constructor(private readonly teamService: TeamService) {}
  async transform(value: number, metadata: ArgumentMetadata): Promise<number> {
    const exist: boolean = await this.teamService.isExistById(value);
    if (!exist)
      throw new NotFoundException('요청하신 자료를 찾을 수 없습니다.');
    return value;
  }
}

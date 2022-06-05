import { EntityRepository, Repository } from 'typeorm';
import Team from '../entities/team.entity';
import { plainToClass } from 'class-transformer';
import { ShowTeamDto } from './dto/show-team.dto';

@EntityRepository(Team)
export class TeamRepository extends Repository<Team> {
  async findShowTeamDtoByPostIdx(postIdx: number): Promise<ShowTeamDto[]> {
    const row = await this.findShowTeamPostDto()
      .where('p.idx = :postIdx', { postIdx: postIdx })
      .getMany();
    return plainToClass(ShowTeamDto, row);
  }

  async findShowTeamDtoByUserId(userId: string): Promise<ShowTeamDto> {
    const row = await this.findShowTeamPostDto()
      .where('u.userId = :userId', { userId: userId })
      .getOne();
    return plainToClass(ShowTeamDto, row);
  }

  private findShowTeamPostDto() {
    return this.createQueryBuilder('t')
      .select(['t.idx', 't.status'])
      .innerJoinAndSelect('t.participants', 'u')
      .innerJoin('t.post', 'p');
  }
}

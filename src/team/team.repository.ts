import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import Team from '../entities/team.entity';
import { plainToClass } from 'class-transformer';
import { ShowTeamDto } from './dto/show-team.dto';

@EntityRepository(Team)
export class TeamRepository extends Repository<Team> {
  async findByUserId(userId: string): Promise<ShowTeamDto> {
    const row = await this.findTeam()
      .where('p.userId = :userId', { userId: userId })
      .getOne();
    return plainToClass(ShowTeamDto, row);
  }

  async findByPostIdx(postIdx: number): Promise<ShowTeamDto[]> {
    const row = await this.findTeam()
      .where('p.postIdx = :postIdx', { postIdx: postIdx })
      .getMany();
    return plainToClass(ShowTeamDto, row);
  }

  private findTeam(): SelectQueryBuilder<Team> {
    return this.createQueryBuilder('t')
      .select(['t.teamIdx', 't.status'])
      .addSelect('u.name', 'participants')
      .innerJoin('t.user', 'u')
      .innerJoin('t.post', 'p');
  }
}

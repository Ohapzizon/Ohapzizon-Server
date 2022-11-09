import Team from '../entities/team.entity';
import dataSource from '../config/database/data-source';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { isExistQuery } from '../common/query/is-exists';

export const teamRepository = dataSource.getRepository(Team).extend({
  async findOneByIdOrFail(teamId: number): Promise<Team> {
    return teamRepository
      .createQueryBuilder('team')
      .where('team.id = :id', { id: teamId })
      .getOneOrFail();
  },

  async findOneWithUserByIdOrFail(teamId: number): Promise<Team> {
    return teamRepository
      .createQueryBuilder('team')
      .where('team.id = :id', { id: teamId })
      .innerJoinAndSelect('team.user', 'participants')
      .getOneOrFail();
  },

  async isExistByPostIdAndUserId(
    postId: number,
    userId: string,
  ): Promise<boolean> {
    return isExistQuery(
      teamRepository
        .createQueryBuilder('team')
        .where('post.id = ?')
        .andWhere('participants.id = ?')
        .innerJoin('team.user', 'participants')
        .innerJoin('team.post', 'post')
        .getQuery(),
      [`${postId}`, `${userId}`],
    );
  },

  findShowTeam(): SelectQueryBuilder<Team> {
    return teamRepository
      .createQueryBuilder('team')
      .select([
        'team.id "teamId"',
        'participantsProfile.displayName "participants"',
        'team.bio "bio"',
        'team.status "status"',
      ])
      .innerJoin('team.user', 'participants')
      .innerJoin('participants.profile', 'participantsProfile');
  },
});

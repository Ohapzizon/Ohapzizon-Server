import Team from '../entities/team.entity';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import dataSource from '../config/database/data-source';
import { isExistQuery } from '../common/row-query/is-exists';

export const teamRepository = dataSource.getRepository(Team).extend({
  async findOneByIdOrFail(teamId: number): Promise<Team> {
    return this.findTeam().where('t.id = :id', { id: teamId }).getOneOrFail();
  },

  async findOneByPostIdAndUserIdOrFail(
    postId: number,
    userId: string,
  ): Promise<Team> {
    return this.findTeam()
      .where('post.id = :id', { id: postId })
      .andWhere('participants.id = :id', { id: userId })
      .getOneOrFail();
  },

  async findByPostId(teamId: number): Promise<Team[]> {
    return this.findTeam().where('t.id = :id', { id: teamId }).getMany();
  },

  findTeam(): SelectQueryBuilder<Team> {
    return this.createQueryBuilder('t')
      .innerJoinAndSelect('t.user', 'participants')
      .innerJoinAndSelect('t.post', 'post')
      .innerJoinAndSelect('post.writer', 'writer');
  },

  findShowTeam(): SelectQueryBuilder<Team> {
    return this.createQueryBuilder('t')
      .select([
        't.id "teamId"',
        'participantsProfile.displayName "participants"',
        't.bio "bio"',
        't.status "status"',
      ])
      .innerJoin('t.user', 'participants')
      .innerJoin('participants.profile', 'participantsProfile');
  },

  findShowPost(): SelectQueryBuilder<Team> {
    return this.createQueryBuilder('t')
      .select([
        'post.id "postId"',
        'post.title "title"',
        'post.contents "contents"',
        'post.limit "limit"',
        'post.targetGrade "targetGrade"',
        'post.reserveDateTime "reserveDateTime"',
        'writerProfile.displayName "writer"',
      ])
      .innerJoin('t.post', 'post')
      .innerJoin('post.writer', 'writer')
      .innerJoin('writer.profile', 'writerProfile');
  },

  async isExistById(teamId: number): Promise<boolean> {
    return isExistQuery(
      teamRepository
        .createQueryBuilder('t')
        .select('t.id')
        .where('t.id = ?')
        .getQuery(),
      [`${teamId}`],
    );
  },
});

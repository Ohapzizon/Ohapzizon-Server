import { DataSource } from 'typeorm';
import Team from '../../entities/team.entity';

export const teamProvider = [
  {
    provide: 'TEAM_REPOSITORY',
    useFactory: async (dataSource: DataSource) =>
      await dataSource.getRepository(Team),
    inject: ['DATA_SOURCE'],
  },
];

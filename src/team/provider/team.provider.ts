import { DataSource } from 'typeorm';
import { DATA_SOURCE, TEAM_REPOSITORY } from '../../common/constants';
import Team from '../../entities/team.entity';

export const teamProvider = [
  {
    provide: TEAM_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Team),
    inject: [DATA_SOURCE],
  },
];

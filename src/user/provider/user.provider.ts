import { DataSource } from 'typeorm';
import { DATA_SOURCE, USER_REPOSITORY } from '../../common/constants';
import User from '../../entities/user.entity';

export const userProvider = [
  {
    provide: USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [DATA_SOURCE],
  },
];

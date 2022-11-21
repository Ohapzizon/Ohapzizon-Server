import { DataSource } from 'typeorm';
import User from '../../entities/user.entity';

export const userProvider = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: async (dataSource: DataSource) => await dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
];

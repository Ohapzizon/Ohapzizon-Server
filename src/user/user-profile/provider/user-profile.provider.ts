import { DataSource } from 'typeorm';
import { DATA_SOURCE, USER_PROFILE_REPOSITORY } from '../../../common/constants';
import UserProfile from '../../../entities/user-profile.entity';

export const userProfileProvider = [
  {
    provide: USER_PROFILE_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserProfile),
    inject: [DATA_SOURCE],
  },
];

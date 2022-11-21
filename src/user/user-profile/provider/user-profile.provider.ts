import { DataSource } from 'typeorm';
import UserProfile from '../../../entities/user-profile.entity';

export const userProfileProvider = [
  {
    provide: 'USER_PROFILE_REPOSITORY',
    useFactory: async (dataSource: DataSource) => {
      console.log(dataSource);
      return dataSource.getRepository(UserProfile);
    },
    inject: ['DATA_SOURCE'],
  },
];

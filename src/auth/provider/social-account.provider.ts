import { DataSource } from 'typeorm';
import SocialAccount from '../../entities/social-account.entity';

export const socialAccountProvider = [
  {
    provide: 'SOCIAL_ACCOUNT_REPOSITORY',
    useFactory: async (dataSource: DataSource) =>
      await dataSource.getRepository(SocialAccount),
    inject: ['DATA_SOURCE'],
  },
];

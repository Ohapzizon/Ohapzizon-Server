import { DataSource } from 'typeorm';
import { DATA_SOURCE, SOCIAL_ACCOUNT_REPOSITORY } from '../../common/constants';
import SocialAccount from '../../entities/social-account.entity';

export const socialAccountProvider = [
  {
    provide: SOCIAL_ACCOUNT_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(SocialAccount),
    inject: [DATA_SOURCE],
  },
];

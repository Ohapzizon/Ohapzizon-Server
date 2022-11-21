import { DataSource } from 'typeorm';
import AuthToken from '../../entities/auth-token.entity';

export const authTokenProvider = [
  {
    provide: 'AUTH_TOKEN_REPOSITORY',
    useFactory: async (dataSource: DataSource) => await dataSource.getRepository(AuthToken),
    inject: ['DATA_SOURCE'],
  },
];

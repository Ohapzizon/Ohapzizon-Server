import { DataSource } from 'typeorm';
import { AUTH_TOKEN_REPOSITORY, DATA_SOURCE } from '../../common/constants';
import AuthToken from '../../entities/auth-token.entity';

export const authTokenProvider = [
  {
    provide: AUTH_TOKEN_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(AuthToken),
    inject: [DATA_SOURCE],
  },
];

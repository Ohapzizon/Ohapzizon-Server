import { Logger } from '@nestjs/common';
import dataSource from './data-source';

export const connectionFactory = {
  provide: 'ASYNC_CONNECTION',
  useFactory: async (logger: Logger) => {
    await dataSource.initialize();
    logger.log('DataSource has been initialized', 'TypeORM');
  },
  inject: [Logger],
};

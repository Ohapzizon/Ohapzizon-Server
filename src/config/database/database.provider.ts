import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import entities from '../../entities';
import { TeamSubscriber } from '../../team/subscriber/team.subscriber';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (configService: ConfigService, logger: Logger) => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PW'),
        database: configService.get<string>('DB_NAME'),
        entities: entities,
        logging: configService.get<string>('NODE_ENV') !== 'production',
        namingStrategy: new SnakeNamingStrategy(),
        subscribers: [TeamSubscriber],
        synchronize: true,
      });
      return dataSource
        .initialize()
        .then(() => {
          logger.log('DataSource has been initialized', 'TypeORM');
        })
        .catch((e) => {
          logger.error(e);
        });
    },
    inject: [ConfigService, Logger],
  },
];

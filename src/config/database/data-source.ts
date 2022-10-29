import entities from '../../entities/index';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config();

const configService = new ConfigService();

const dataSource = new DataSource({
  type: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: +configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PW'),
  database: configService.get<string>('DB_NAME'),
  entities: entities,
  dropSchema: false,
  synchronize: false,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
});

export default dataSource;

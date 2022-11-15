import entities from '../../entities/index';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(
    process.env.NODE_ENV === 'production'
      ? '.production.env'
      : '.development.env',
  ),
});

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
  entities: entities,
  logging: process.env.NODE_ENV !== 'production',
  namingStrategy: new SnakeNamingStrategy(),
});

export default dataSource;

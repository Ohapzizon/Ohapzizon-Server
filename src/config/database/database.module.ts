import { Global, Logger, Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';

@Global()
@Module({
  providers: [...databaseProviders, Logger],
  exports: [...databaseProviders],
})
export class DatabaseModule {}

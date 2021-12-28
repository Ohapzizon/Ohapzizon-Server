import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';

@Module({
  imports: [TypeOrmModule.forRootAsync({ useClass: DatabaseService })],
})
export class DatabaseModule {}

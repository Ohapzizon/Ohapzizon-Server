import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TerminusModule } from '@nestjs/terminus';
import { HealthCheckController } from './health-check.controller';
import { DatabaseModule } from '../config/database/database.module';

@Module({
  imports: [TerminusModule, HttpModule, DatabaseModule],
  controllers: [HealthCheckController],
})
export class HealthCheckModule {}

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TerminusModule } from '@nestjs/terminus';
import { HealthCheckController } from './health-check.controller';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthCheckController],
})
export class HealthCheckModule {}

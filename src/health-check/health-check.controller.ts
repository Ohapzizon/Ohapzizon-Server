import { BadRequestException, Controller, Get, Inject } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { DataSource } from 'typeorm';
import { DATA_SOURCE } from '../common/constants';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('health-check')
@Controller('health-check')
export class HealthCheckController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly db: TypeOrmHealthIndicator,
    @Inject(DATA_SOURCE) private readonly dataSource: DataSource,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('api-docs', 'https://localhost:3000/docs'),
      () => this.db.pingCheck('database', { connection: this.dataSource }),
    ]);
  }

  @Get('error')
  throw() {
    throw new BadRequestException();
  }
}

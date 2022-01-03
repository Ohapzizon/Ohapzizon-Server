import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationRepository } from './organization.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationRepository])],
})
export class OrganizationModule {}

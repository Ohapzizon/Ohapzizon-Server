import { EntityRepository, Repository } from 'typeorm';
import Organization from '../entities/organization.entity';

@EntityRepository(Organization)
export class OrganizationRepository extends Repository<Organization> {}

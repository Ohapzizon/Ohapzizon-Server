import { EntityRepository, Repository } from 'typeorm';
import Group from '../entities/group.entity';

@EntityRepository(Group)
export class GroupRepository extends Repository<Group>{}
import { EntityRepository, Repository } from 'typeorm';
import Organization from '../entities/organization.entity';
import { UserAlreadyExistsException } from '../config/exception/user-already-exists.exception';

@EntityRepository(Organization)
export class OrganizationRepository extends Repository<Organization> {
  async findUser(user_: string) {
    const organization: Organization = await this.findOne({
      where: { user: user_ },
      relations: ['user'],
    });
    if (organization) {
      if (organization.user.user_idx == user_) {
        throw new UserAlreadyExistsException();
      }
    }
  }
}

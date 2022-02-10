import { EntityRepository, Repository } from 'typeorm';
import Organization from '../entities/organization.entity';
import { UserAlreadyExistsException } from '../config/exception/user-already-exists.exception';

@EntityRepository(Organization)
export class OrganizationRepository extends Repository<Organization> {
  async userExistsCheck(currentUser: string, currentPost: number) {
    const organization: Organization = await this.findOne({
      where: { post: currentPost },
      relations: ['user'],
    });
    const savedUser = organization.user.user_idx;
    if (organization)
      if (savedUser == currentUser) throw new UserAlreadyExistsException();
  }
}

import { Injectable } from '@nestjs/common';
import { GroupRepository } from './group.repository';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async saveGroup() {
    const group = this.groupRepository.create();
    return this.groupRepository.save(group);
  }
}

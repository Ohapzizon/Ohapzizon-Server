import { Injectable } from '@nestjs/common';
import { GroupRepository } from './group.repository';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {
  }

  async saveGroup(idx: number) {
    const group = this.groupRepository.create({ idx: idx });
    return this.groupRepository.save(group);
  }
}

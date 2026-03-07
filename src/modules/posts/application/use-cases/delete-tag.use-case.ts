import { Injectable } from '@nestjs/common';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { TagNotFoundException } from '../../domain/exceptions/tag-not-found.exception';
import { UserCannotManageTagsException } from '../../domain/exceptions/user-cannot-manage-tags.exception';

@Injectable()
export class DeleteTagUseCase {
  constructor(private readonly tagRepository: TagRepository) {}

  async execute(id: string, user: UserEntity): Promise<void> {
    // 1. Check permissions
    if (!user.permissions.tags.canManage()) {
      throw new UserCannotManageTagsException();
    }

    // 2. Find the existing tag to ensure it exists
    const tag = await this.tagRepository.findById(id);
    if (!tag) {
      throw new TagNotFoundException(id);
    }

    // 3. Delete it
    await this.tagRepository.delete(id);
  }
}

import { Injectable } from '@nestjs/common';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { TagEntity } from '../../domain/entitties/tag.entity';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { TagAlreadyExistsException } from '../../domain/exceptions/tag-already-exists.exception';
import { UserCannotManageTagsException } from '../../../posts/domain/exceptions/user-cannot-manage-tags.exception';
import { TagsPermissions } from '../../domain/premissions/tags-permissions';

@Injectable()
export class CreateTagUseCase {
  constructor(private readonly tagRepository: TagRepository) {}

  async execute(name: string, user: UserEntity): Promise<TagEntity> {
    // 1. Check permissions (ABAC/RBAC)
    if (!TagsPermissions.canManage(user)) {
      throw new UserCannotManageTagsException();
    }

    // 2. Check for duplicates
    const existingTag = await this.tagRepository.findByName(name);
    if (existingTag) {
      throw new TagAlreadyExistsException(name);
    }

    // 3. Create and save the entity
    const newTag = TagEntity.create(name);
    await this.tagRepository.save(newTag);

    return newTag;
  }
}

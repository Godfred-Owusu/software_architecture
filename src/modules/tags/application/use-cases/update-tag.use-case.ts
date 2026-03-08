import { Injectable } from '@nestjs/common';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { TagEntity } from '../../domain/entitties/tag.entity';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { TagNotFoundException } from '../../domain/exceptions/tag-not-found.exception';
import { TagAlreadyExistsException } from '../../domain/exceptions/tag-already-exists.exception';
import { UserCannotManageTagsException } from '../../../posts/domain/exceptions/user-cannot-manage-tags.exception';
import { TagsPermissions } from '../../domain/premissions/tags-permissions';

@Injectable()
export class UpdateTagUseCase {
  constructor(private readonly tagRepository: TagRepository) {}

  async execute(
    id: string,
    newName: string,
    user: UserEntity,
  ): Promise<TagEntity> {
    // 1. Check permissions
    if (!TagsPermissions.canManage(user)) {
      throw new UserCannotManageTagsException();
    }

    // 2. Find the existing tag
    const tag = await this.tagRepository.findById(id);
    if (!tag) {
      throw new TagNotFoundException(id);
    }

    // 3. If the name is changing, check for duplicates
    if (tag.name.toString() !== newName.toLowerCase()) {
      const existingTag = await this.tagRepository.findByName(newName);
      if (existingTag) {
        throw new TagAlreadyExistsException(newName);
      }
    }

    // 4. Update the domain entity (this will run the TagName value object validation!)
    tag.updateName(newName);

    // 5. Save the updated tag
    await this.tagRepository.save(tag);

    return tag;
  }
}

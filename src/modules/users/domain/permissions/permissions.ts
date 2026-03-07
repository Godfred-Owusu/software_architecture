import { UserRole } from '../entities/user.entity';
import { PostPermissions } from './post-permissions';
import { TagsPermissions } from './tags-permissions';

export class Permissions {
  public readonly posts: PostPermissions;
  public readonly tags: TagsPermissions;

  constructor(userId: string, role: UserRole) {
    this.posts = new PostPermissions(userId, role);
    this.tags = new TagsPermissions(role);
  }
}

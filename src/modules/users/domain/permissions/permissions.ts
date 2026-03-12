import { UserRole } from '../entities/user.entity';
import { PostPermissions } from './post-permissions';
import { CommentPermissions } from './comment-permissions';

export class Permissions {
  public readonly posts: PostPermissions;
  public readonly comments: CommentPermissions;

  constructor(userId: string, role: UserRole) {
    this.posts = new PostPermissions(userId, role);
    this.comments = new CommentPermissions(userId, role);
  }
}

import { UserRole } from '../entities/user.entity';
import { CommentEntity } from '../../../comments/domain/entities/comment.entity';
import { PostEntity } from '../../../posts/domain/entities/post.entity';

export class CommentPermissions {
  constructor(
    private readonly userId: string,
    private readonly role: UserRole,
  ) {}

  public canUpdate(comment: CommentEntity): boolean {
    return comment.authorId === this.userId;
  }

  public canDelete(comment: CommentEntity, post: PostEntity): boolean {
    // 1. Comment author can delete their own
    if (comment.authorId === this.userId) return true;

    // 2. Post author can delete any comment on their post
    if (post.authorId === this.userId) return true;

    // 3. Moderators and Admins can delete anything
    if (this.role === 'moderator' || this.role === 'admin') return true;

    return false;
  }
}

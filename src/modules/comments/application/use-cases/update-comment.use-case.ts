import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../../domain/repositories/comment.repository';
// 1. Remove UserRepository import, you don't need it anymore!
import { CommentNotFoundException } from '../../domain/exceptions/comment-not-found.exception';
import { NotCommentAuthorException } from '../../domain/exceptions/not-comment-author.exception';
import { UserEntity } from '../../../users/domain/entities/user.entity'; // 2. Import UserEntity

@Injectable()
export class UpdateCommentUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    // UserRepository removed from constructor
  ) {}

  public async execute(
    commentId: string,
    user: UserEntity, // 3. CHANGED: Accept the full UserEntity
    newContent: string,
  ): Promise<any> {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) throw new CommentNotFoundException(commentId); // 404

    // 4. CHANGED: Use your elegant permissions check!
    if (!user.permissions.comments.canUpdate(comment)) {
      throw new NotCommentAuthorException(); // 403
    }

    // Update via domain entity
    comment.updateContent(newContent);
    await this.commentRepository.save(comment);

    // 5. CHANGED: We already have the user, so we don't need to query the DB again!
    const authorJson = user.toJSON();

    return {
      id: comment.id,
      postId: comment.postId,
      content: comment.toJSON().content,
      author: { id: authorJson.id, username: authorJson.username },
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    };
  }
}

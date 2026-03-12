import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception'; // Adjust path if needed

export class CommentNotFoundException extends DomainException {
  constructor(commentId?: string) {
    super(
      commentId
        ? `Comment with ID ${commentId} not found`
        : 'Comment not found',
      'COMMENT_NOT_FOUND',
    );
  }
}

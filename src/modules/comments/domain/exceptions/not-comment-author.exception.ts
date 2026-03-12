import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class NotCommentAuthorException extends DomainException {
  constructor() {
    super('You can only update your own comments', 'NOT_COMMENT_AUTHOR');
  }
}

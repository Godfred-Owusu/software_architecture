import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';
export class CannotDeleteCommentException extends DomainException {
  constructor() {
    super(
      'You do not have permission to delete this comment',
      'CANNOT_DELETE_COMMENT',
    );
  }
}

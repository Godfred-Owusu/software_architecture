import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class UserCannotViewPostException extends DomainException {
  constructor() {
    // Passes the exact message and code to your DomainExceptionFilter
    super(
      'You do not have permission to view this draft',
      'USER_CANNOT_VIEW_POST',
    );
  }
}

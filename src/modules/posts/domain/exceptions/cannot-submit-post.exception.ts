import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class CannotSubmitPostException extends DomainException {
  constructor() {
    super(
      'Only the author can submit this post for review',
      'CANNOT_SUBMIT_POST',
    ); // 403 Forbidden
  }
}

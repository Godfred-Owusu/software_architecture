import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class CannotFollowSelfException extends DomainException {
  constructor() {
    super('You cannot follow yourself', 'CANNOT_FOLLOW_SELF'); // Maps to 400 Bad Request
  }
}

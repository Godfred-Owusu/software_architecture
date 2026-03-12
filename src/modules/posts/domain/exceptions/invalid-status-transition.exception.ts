import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class InvalidStatusTransitionException extends DomainException {
  constructor(message: string) {
    super(message, 'INVALID_STATUS_TRANSITION'); // 400 Bad Request
  }
}

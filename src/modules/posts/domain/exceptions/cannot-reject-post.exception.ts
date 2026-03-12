import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';
export class CannotRejectPostException extends DomainException {
  constructor() {
    super('Only moderators can reject posts', 'CANNOT_REJECT_POST'); // 403 Forbidden
  }
}

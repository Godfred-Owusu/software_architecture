import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class CannotApprovePostException extends DomainException {
  constructor() {
    super('Only moderators can approve posts', 'CANNOT_APPROVE_POST'); // 403 Forbidden
  }
}

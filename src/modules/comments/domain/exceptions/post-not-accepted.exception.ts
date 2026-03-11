import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception'; // Adjust path

export class PostNotAcceptedException extends DomainException {
  constructor() {
    // Make sure to add 'POST_NOT_ACCEPTED' to your DomainExceptionFilter mapped to 403!
    super('Comments can only be added to ACCEPTED posts', 'POST_NOT_ACCEPTED');
  }
}

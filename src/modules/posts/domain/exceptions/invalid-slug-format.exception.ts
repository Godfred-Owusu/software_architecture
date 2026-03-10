import { DomainException } from 'src/modules/shared/errors/domain/exceptions/domain.exception'; // Adjust this path!

export class InvalidSlugFormatException extends DomainException {
  constructor(message: string) {
    // Passes the specific validation message and the 'INVALID_SLUG' code to the filter
    super(message, 'INVALID_SLUG');
  }
}

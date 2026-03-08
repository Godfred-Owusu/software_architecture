import { DomainException } from 'src/modules/shared/errors/domain/exceptions/domain.exception'; // Adjust this path as needed
export class TagNotAttachedException extends DomainException {
  constructor() {
    // You can map this to a 404 or 400 in your Exception Filter
    super('Tag is not associated with this post', 'TAG_NOT_ATTACHED');
  }
}

import { DomainException } from 'src/modules/shared/errors/domain/exceptions/domain.exception'; // Adjust this path as needed
export class TagAlreadyAttachedException extends DomainException {
  constructor() {
    // The exact message your lecturer requested!
    super('Tag already associated with this post', 'TAG_ALREADY_ATTACHED');
  }
}

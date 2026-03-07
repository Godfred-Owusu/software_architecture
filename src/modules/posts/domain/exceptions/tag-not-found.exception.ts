import { DomainException } from 'src/modules/shared/errors/domain/exceptions/domain.exception';

export class TagNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Tag with ID '${id}' was not found.`, 'TAG_NOT_FOUND');
  }
}

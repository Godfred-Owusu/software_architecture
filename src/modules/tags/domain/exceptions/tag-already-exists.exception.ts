import { DomainException } from 'src/modules/shared/errors/domain/exceptions/domain.exception';

export class TagAlreadyExistsException extends DomainException {
  constructor(name: string) {
    super(
      `A tag with the name '${name}' already exists.`,
      'TAG_ALREADY_EXISTS',
    );
  }
}

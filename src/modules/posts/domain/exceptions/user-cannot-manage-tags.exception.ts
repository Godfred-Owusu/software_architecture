import { DomainException } from 'src/modules/shared/errors/domain/exceptions/domain.exception';

export class UserCannotManageTagsException extends DomainException {
  constructor() {
    super('Only administrators can manage tags.', 'USER_CANNOT_MANAGE_TAGS');
  }
}

import { DomainException } from 'src/modules/shared/errors/domain/exceptions/domain.exception'; // Adjust this path!

export class UserCannotModifyPostException extends DomainException {
  constructor() {
    super(
      'User does not have permission to modify this post tags',
      'USER_CANNOT_UPDATE_POST',
    );
  }
}

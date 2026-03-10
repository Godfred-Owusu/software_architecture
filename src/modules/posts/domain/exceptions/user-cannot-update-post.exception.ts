import { DomainException } from 'src/modules/shared/errors/domain/exceptions/domain.exception'; // Adjust this path!

export class UserCannotUpdatePostException extends DomainException {
  constructor() {
    // Passes the message and the specific error code to the base class
    super(
      'You are not authorized to update this post',
      'USER_CANNOT_UPDATE_POST',
    );
  }
}

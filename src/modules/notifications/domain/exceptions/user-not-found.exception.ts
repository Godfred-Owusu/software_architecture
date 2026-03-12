import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class UserNotFoundException extends DomainException {
  constructor(userId: string) {
    super(`User with ID ${userId} not found`, 'USER_NOT_FOUND'); // Maps to 404 Not Found
  }
}

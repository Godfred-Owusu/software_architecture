import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception'; // Adjust path if needed

export class UserNotFoundException extends DomainException {
  constructor(userId: string) {
    // Make sure 'USER_NOT_FOUND' is mapped to 404 in your DomainExceptionFilter!
    super(`User with ID ${userId} not found`, 'USER_NOT_FOUND');
  }
}

import { DomainException } from 'src/modules/shared/errors/domain/exceptions/domain.exception'; // Adjust this path!

export class PostNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Post with ID ${id} not found`, 'POST_NOT_FOUND');
  }
}

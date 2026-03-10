import { DomainException } from 'src/modules/shared/errors/domain/exceptions/domain.exception'; // Adjust this path!

export class SlugAlreadyInUseException extends DomainException {
  constructor(slug: string) {
    // 👇 Passes the message and your custom code to the DomainExceptionFilter
    super(
      `The slug '${slug}' is already in use by another post.`,
      'SLUG_ALREADY_EXISTS',
    );
  }
}

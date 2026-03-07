import { DomainException } from 'src/modules/shared/errors/domain/exceptions/domain.exception';

export class InvalidTagNameException extends DomainException {
  constructor() {
    super(
      'Tag name must be 2-50 characters, lowercase, alphanumeric, and may contain hyphens',
      'INVALID_TAG_NAME',
    );
  }
}

// export class TagName {
//   private readonly value: string;

//   constructor(value: string) {
//     const trimmed = value.trim();

//     // Regex: Start with lowercase letter/number, allow hyphens in middle, end with letter/number. Length 2-50.
//     const isValid = /^[a-z0-9][a-z0-9-]{0,48}[a-z0-9]$/.test(trimmed);

//     if (!isValid) {
//       throw new InvalidTagNameException();
//     }

//     this.value = trimmed;
//   }

//   public getValue(): string {
//     return this.value;
//   }
// }

export class TagName {
  private readonly value: string;

  constructor(input: string) {
    this.validate(input);
    this.value = input.toLowerCase();
  }

  private validate(input: string): void {
    if (!input || input.trim().length === 0) {
      throw new Error('Tag name cannot be empty');
    }
    if (input.length < 2) {
      throw new Error('Tag name too short (min 2 chars)');
    }
    if (input.length > 50) {
      throw new Error('Tag name too long (max 50 chars)');
    }
    if (!/^[a-z0-9-]+$/.test(input.toLowerCase())) {
      throw new Error(
        'Tag name must be lowercase alphanumeric and may contain hyphens',
      );
    }
  }

  toString(): string {
    return this.value;
  }
}

/** 
 * 
 * 
 * export class TagName {
  private readonly value: string;

  constructor(input: string) {
    this.validate(input);
    this.value = input.toLowerCase();
  }

  private validate(input: string): void {
    if (!input || input.trim().length === 0) {
      throw new Error('Tag name cannot be empty');
    }
    if (input.length < 2) {
      throw new Error('Tag name too short (min 2 chars)');
    }
    if (input.length > 50) {
      throw new Error('Tag name too long (max 50 chars)');
    }
    if (!/^[a-z0-9-]+$/.test(input.toLowerCase())) {
      throw new Error(
        'Tag name must be lowercase alphanumeric and may contain hyphens',
      );
    }
  }

  toString(): string {
    return this.value;
  }
}
 */

// export class PostSlug {
//   private readonly value: string;

//   public constructor(value: string) {
//     this.value = value;
//   }

//   public static create(slug: string): PostSlug {
//     // 1. Must not be empty after trimming
//     const trimmedSlug = slug.trim();
//     if (!trimmedSlug) {
//       throw new Error('Slug cannot be empty');
//     }

//     // 2. Must be 3-100 characters
//     if (trimmedSlug.length < 3 || trimmedSlug.length > 100) {
//       throw new Error('Slug must be between 3 and 100 characters');
//     }

//     // 3. Must be lowercase, alphanumeric, hyphens only
//     // 4. Must not start or end with a hyphen
//     const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
//     if (!slugRegex.test(trimmedSlug)) {
//       throw new Error(
//         'Slug must be lowercase, alphanumeric, contain only hyphens, and cannot start or end with a hyphen',
//       );
//     }

//     return new PostSlug(trimmedSlug);
//   }

//   public toString(): string {
//     return this.value;
//   }
// }

// 👇 1. Import the new exception
import { InvalidSlugFormatException } from '../exceptions/invalid-slug-format.exception';

export class PostSlug {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(slug: string): PostSlug {
    const trimmedSlug = slug.trim();

    // 👇 2. Swap "Error" for "InvalidSlugFormatException"
    if (!trimmedSlug) {
      throw new InvalidSlugFormatException('Slug cannot be empty');
    }

    if (trimmedSlug.length < 3 || trimmedSlug.length > 100) {
      throw new InvalidSlugFormatException(
        'Slug must be between 3 and 100 characters',
      );
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(trimmedSlug)) {
      throw new InvalidSlugFormatException(
        'Slug must be lowercase, alphanumeric, contain only hyphens, and cannot start or end with a hyphen',
      );
    }

    return new PostSlug(trimmedSlug);
  }

  public toString(): string {
    return this.value;
  }
}

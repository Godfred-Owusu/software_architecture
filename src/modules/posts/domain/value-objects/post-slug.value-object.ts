export class PostSlug {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(slug: string): PostSlug {
    // 1. Must not be empty after trimming
    const trimmedSlug = slug.trim();
    if (!trimmedSlug) {
      throw new Error('Slug cannot be empty');
    }

    // 2. Must be 3-100 characters
    if (trimmedSlug.length < 3 || trimmedSlug.length > 100) {
      throw new Error('Slug must be between 3 and 100 characters');
    }

    // 3. Must be lowercase, alphanumeric, hyphens only
    // 4. Must not start or end with a hyphen
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(trimmedSlug)) {
      throw new Error(
        'Slug must be lowercase, alphanumeric, contain only hyphens, and cannot start or end with a hyphen',
      );
    }

    return new PostSlug(trimmedSlug);
  }

  public getValue(): string {
    return this.value;
  }
}

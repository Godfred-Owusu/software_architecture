export class CommentContent {
  private constructor(private readonly value: string) {}

  public static create(content: string): CommentContent {
    const trimmed = content?.trim() || '';

    if (!trimmed) {
      throw new Error('Comment content cannot be empty');
    }

    if (trimmed.length > 1000) {
      throw new Error('Comment content cannot exceed 1000 characters');
    }

    return new CommentContent(trimmed);
  }

  public toString(): string {
    return this.value;
  }
}

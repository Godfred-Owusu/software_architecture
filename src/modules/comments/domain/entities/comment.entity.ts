import { v4 as uuidv4 } from 'uuid';
import { CommentContent } from '../value-objects/comment-content.value-object';

export class CommentEntity {
  private constructor(
    public readonly id: string,
    public readonly postId: string,
    public readonly authorId: string,
    private content: CommentContent,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  // Used when a user posts a brand new comment
  public static create(
    postId: string,
    authorId: string,
    contentStr: string,
  ): CommentEntity {
    const now = new Date();
    return new CommentEntity(
      uuidv4(),
      postId,
      authorId,
      CommentContent.create(contentStr),
      now,
      now, // createdAt and updatedAt are the same initially
    );
  }

  // Used by your Repository to load an existing comment from SQLite
  public static reconstitute(
    id: string,
    postId: string,
    authorId: string,
    contentStr: string,
    createdAt: Date,
    updatedAt: Date,
  ): CommentEntity {
    return new CommentEntity(
      id,
      postId,
      authorId,
      CommentContent.create(contentStr),
      createdAt,
      updatedAt,
    );
  }

  // Business Rule: Users can update their own comments at any time[cite: 1]
  public updateContent(newContent: string): void {
    this.content = CommentContent.create(newContent);
    this.updatedAt = new Date(); // Automatically bump the update timestamp
  }

  public toJSON() {
    return {
      id: this.id,
      postId: this.postId,
      authorId: this.authorId,
      content: this.content.toString(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

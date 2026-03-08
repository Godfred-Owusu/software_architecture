import { v4 } from 'uuid';
import { PostContent } from '../value-objects/post-content.value-object';
import { PostTitle } from '../value-objects/post-title.value-object';
import { TagAlreadyAttachedException } from '../exceptions/tag-already-attached.exception';
import { TagNotAttachedException } from '../exceptions/tag-not-attached.exception';

export type PostStatus = 'draft' | 'waiting' | 'accepted' | 'rejected';

export class PostEntity {
  private _title: PostTitle;
  private _content: PostContent;
  private _authorId: string;
  private _status: PostStatus;
  private _tags: string[] = [];

  private constructor(
    readonly id: string,
    title: PostTitle,
    content: PostContent,
    authorId: string,
    status: PostStatus,
    tags?: string[],
  ) {
    this._title = title;
    this._content = content;
    this._authorId = authorId;
    this._status = status;
    this._tags = tags || [];
  }

  public get status() {
    return this._status;
  }

  public get authorId() {
    return this._authorId;
  }

  public get tags(): string[] {
    return [...this._tags];
  }

  public addTag(tagId: string): void {
    if (this._tags.includes(tagId)) {
      throw new TagAlreadyAttachedException();
    }
    this._tags.push(tagId);
  }

  // Behavior to remove a tag
  public removeTag(tagId: string): void {
    if (!this._tags.includes(tagId)) {
      // 👇 Throw the domain error! 👇
      throw new TagNotAttachedException();
    }
    this._tags = this._tags.filter((id) => id !== tagId);
  }

  public static reconstitute(input: Record<string, unknown>) {
    return new PostEntity(
      input.id as string,
      new PostTitle(input.title as string),
      new PostContent(input.content as string),
      input.authorId as string,
      input.status as PostStatus,
      (input.tags as string[]) || [],
    );
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      title: this._title.toString(),
      content: this._content.toString(),
      status: this._status,
      authorId: this._authorId,
      tags: this._tags,
    };
  }

  public static create(
    title: string,
    content: string,
    authorId: string,
  ): PostEntity {
    return new PostEntity(
      v4(),
      new PostTitle(title),
      new PostContent(content),
      authorId,
      'draft',
    );
  }

  public update(title?: string, content?: string) {
    if (title) {
      this._title = new PostTitle(title);
    }

    if (content) {
      this._content = new PostContent(content);
    }
  }
}

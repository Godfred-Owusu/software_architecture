import { v4 as uuidv4 } from 'uuid';
import { TagName } from '../value-objects/tag-name';

export class TagEntity {
  private constructor(
    public readonly id: string,
    public name: TagName,
    public readonly createdAt: Date,
  ) {}

  // Used when an Admin creates a brand new tag
  public static create(nameStr: string): TagEntity {
    return new TagEntity(
      uuidv4(),
      new TagName(nameStr.toLowerCase()), // Force lowercase per rules
      new Date(),
    );
  }

  // Used when pulling an existing tag from the database
  public static reconstitute(
    id: string,
    nameStr: string,
    createdAt: Date,
  ): TagEntity {
    return new TagEntity(id, new TagName(nameStr), createdAt);
  }

  // Used for updating the tag name
  public updateName(newName: string): void {
    this.name = new TagName(newName.toLowerCase());
  }
}

import { TagEntity } from '../entities/tag.entity';

export abstract class TagRepository {
  abstract save(tag: TagEntity): Promise<void>;
  abstract findById(id: string): Promise<TagEntity | null>;
  abstract findByName(name: string): Promise<TagEntity | null>;
  abstract findAll(): Promise<TagEntity[]>;
  abstract delete(id: string): Promise<void>;
}

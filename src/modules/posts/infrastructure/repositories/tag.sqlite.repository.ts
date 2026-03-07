import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { SQLiteTagEntity } from '../entities/tag.sqlite.entity';

@Injectable()
export class SQLiteTagRepository implements TagRepository {
  constructor(
    @InjectRepository(SQLiteTagEntity)
    private readonly ormRepository: Repository<SQLiteTagEntity>,
  ) {}

  // 1. Save a Domain Tag into the Database
  async save(tag: TagEntity): Promise<void> {
    const ormTag = this.ormRepository.create({
      id: tag.id,
      name: tag.name.getValue(), // Extract the raw string from the Value Object
      createdAt: tag.createdAt,
    });
    await this.ormRepository.save(ormTag);
  }

  // 2. Find a Tag by ID and turn it back into a Domain Entity
  // Changed to return undefined
  async findById(id: string): Promise<TagEntity | undefined> {
    const ormTag = await this.ormRepository.findOne({ where: { id } });
    if (!ormTag) return undefined;

    return TagEntity.reconstitute(ormTag.id, ormTag.name, ormTag.createdAt);
  }

  // Changed to return undefined
  async findByName(name: string): Promise<TagEntity | undefined> {
    const ormTag = await this.ormRepository.findOne({
      where: { name: name.toLowerCase() },
    });
    if (!ormTag) return undefined;

    return TagEntity.reconstitute(ormTag.id, ormTag.name, ormTag.createdAt);
  }

  // 4. Get all Tags
  async findAll(): Promise<TagEntity[]> {
    const ormTags = await this.ormRepository.find();
    return ormTags.map((t) =>
      TagEntity.reconstitute(t.id, t.name, t.createdAt),
    );
  }

  // 5. Delete a Tag
  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

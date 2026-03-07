import { Injectable } from '@nestjs/common';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { TagEntity } from '../../domain/entities/tag.entity';

@Injectable()
export class GetAllTagsUseCase {
  constructor(private readonly tagRepository: TagRepository) {}

  async execute(): Promise<TagEntity[]> {
    return this.tagRepository.findAll();
  }
}

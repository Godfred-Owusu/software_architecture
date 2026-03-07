import { Module } from '@nestjs/common';
import { TagRepository } from './domain/repositories/tag.repository';
import { SQLiteTagRepository } from './infrastructure/repositories/tag.sqlite.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SQLiteTagEntity } from './infrastructure/entities/tag.sqlite.entity';
import { TagsController } from './infrastructure/controllers/tags.controller';
import { CreateTagUseCase } from './application/use-cases/create-tag.use-case';
import { GetAllTagsUseCase } from './application/use-cases/get-all-tags.use-case';
import { UpdateTagUseCase } from './application/use-cases/update-tag.use-case';
import { DeleteTagUseCase } from './application/use-cases/delete-tag.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([SQLiteTagEntity])],
  controllers: [TagsController],
  providers: [
    {
      provide: TagRepository,
      useClass: SQLiteTagRepository,
    },
    CreateTagUseCase,
    GetAllTagsUseCase,
    UpdateTagUseCase,
    DeleteTagUseCase,
  ],
  exports: [TagRepository],
})
export class TagsModule {}

import { Module } from '@nestjs/common';
import { AuthModule } from '../shared/auth/auth.module';
import { LoggingModule } from '../shared/logging/logging.module';
import { CreatePostUseCase } from './application/use-cases/create-post.use-case';
import { DeletePostUseCase } from './application/use-cases/delete-post.use-case';
import { GetPostByIdUseCase } from './application/use-cases/get-post-by-id.use-case';
import { GetPostsUseCase } from './application/use-cases/get-posts.use-case';
import { UpdatePostUseCase } from './application/use-cases/update-post.use-case';
import { PostRepository } from './domain/repositories/post.repository';
import { PostController } from './infrastructure/controllers/post.controller';
// import { InMemoryPostRepository } from './infrastructure/repositories/post.in-memory.repository';
import { SQLitePostRepository } from './infrastructure/repositories/post.sqlite.repository';
import { SQLiteTagRepository } from './infrastructure/repositories/tag.sqlite.repository';
import { TagRepository } from './domain/repositories/tag.repository';
import { CreateTagUseCase } from './application/use-cases/create-tag.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SQLiteTagEntity } from './infrastructure/entities/tag.sqlite.entity';
import { UpdateTagUseCase } from './application/use-cases/update-tag.use-case';
import { DeleteTagUseCase } from './application/use-cases/delete-tag.use-case';
import { GetAllTagsUseCase } from './application/use-cases/get-all-tags.use-case';
import { TagsController } from './infrastructure/controllers/tags.controller';

@Module({
  imports: [
    AuthModule,
    LoggingModule,
    TypeOrmModule.forFeature([SQLiteTagEntity]),
  ],
  controllers: [PostController, TagsController],
  providers: [
    {
      provide: PostRepository,
      useClass: SQLitePostRepository,
    },
    {
      provide: TagRepository,
      useClass: SQLiteTagRepository,
    },

    CreatePostUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,
    GetPostsUseCase,
    GetPostByIdUseCase,
    CreateTagUseCase,
    UpdateTagUseCase,
    DeleteTagUseCase,
    GetAllTagsUseCase,
  ],
})
export class PostModule {}

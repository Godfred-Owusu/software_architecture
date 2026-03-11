import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SQLiteCommentEntity } from './infrastructure/entities/sqlite-comment.entity';
import { CommentController } from './infrastructure/controller/comment.controller';
import { CreateCommentUseCase } from './application/use-cases/create-comment.use-case';
import { CommentRepository } from './domain/repositories/comment.repository';
import { SqliteCommentRepository } from './infrastructure/repositories/sqlite-comment.repository';
import { PostModule } from '../posts/post.module';
import { UserModule } from '../users/user.module';

// 👇 Import the modules where you export PostRepository and UserRepository

@Module({
  imports: [
    TypeOrmModule.forFeature([SQLiteCommentEntity]),
    PostModule, // To access PostRepository
    UserModule, // To access UserRepository
  ],
  controllers: [CommentController],
  providers: [
    CreateCommentUseCase,
    {
      provide: CommentRepository,
      useClass: SqliteCommentRepository,
    },
  ],
})
export class CommentsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SQLiteCommentEntity } from './infrastructure/entities/sqlite-comment.entity';
import { CommentController } from './infrastructure/controller/comment.controller';
import { CreateCommentUseCase } from './application/use-cases/create-comment.use-case';
import { CommentRepository } from './domain/repositories/comment.repository';
import { SqliteCommentRepository } from './infrastructure/repositories/sqlite-comment.repository';
import { PostModule } from '../posts/post.module';
import { UserModule } from '../users/user.module';
import { ListCommentsUseCase } from './application/use-cases/list-comments.use-case';
import { UpdateCommentUseCase } from './application/use-cases/update-comment.use-case';
import { DeleteCommentUseCase } from './application/use-cases/delete-comment.use-case';
import { GetCommentCountUseCase } from './application/use-cases/get-comment-count.use-case';
import { CommentRootController } from './infrastructure/controller/comment-root.controller';

// 👇 Import the modules where you export PostRepository and UserRepository

@Module({
  imports: [
    TypeOrmModule.forFeature([SQLiteCommentEntity]),
    PostModule,
    UserModule,
  ],
  controllers: [CommentController, CommentRootController],
  providers: [
    CreateCommentUseCase,
    ListCommentsUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,
    GetCommentCountUseCase,
    {
      provide: CommentRepository,
      useClass: SqliteCommentRepository,
    },
  ],
  exports: [CommentRepository],
})
export class CommentsModule {}

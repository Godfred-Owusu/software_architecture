import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { SQLiteCommentEntity } from '../entities/sqlite-comment.entity';

@Injectable()
export class SqliteCommentRepository implements CommentRepository {
  constructor(
    @InjectRepository(SQLiteCommentEntity)
    private readonly repository: Repository<SQLiteCommentEntity>,
  ) {}

  public async save(comment: CommentEntity): Promise<void> {
    const json = comment.toJSON();

    // Map Domain Entity to TypeORM Entity
    const sqliteComment = this.repository.create({
      id: json.id,
      postId: json.postId,
      authorId: json.authorId,
      content: json.content, // Pulling the string out of the Value Object
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    });

    await this.repository.save(sqliteComment);
  }
}

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

  public async findByPostId(
    postId: string,
    page: number,
    pageSize: number,
    sortBy: string,
    order: 'asc' | 'desc',
  ): Promise<[CommentEntity[], number]> {
    const skip = (page - 1) * pageSize;

    const [sqliteComments, total] = await this.repository.findAndCount({
      where: { postId },
      order: {
        [sortBy]: order.toUpperCase(), // TypeORM expects 'ASC' or 'DESC'
      },
      skip,
      take: pageSize,
    });

    // Reconstitute back to Domain Entities
    const comments = sqliteComments.map((c) =>
      CommentEntity.reconstitute(
        c.id,
        c.postId,
        c.authorId,
        c.content,
        c.createdAt,
        c.updatedAt,
      ),
    );

    return [comments, total];
  }
}

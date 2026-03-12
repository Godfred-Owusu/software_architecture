import { CommentEntity } from '../entities/comment.entity';

export abstract class CommentRepository {
  abstract save(comment: CommentEntity): Promise<void>;
  abstract findByPostId(
    postId: string,
    page: number,
    pageSize: number,
    sortBy: string,
    order: 'asc' | 'desc',
  ): Promise<[CommentEntity[], number]>;

  abstract findById(id: string): Promise<CommentEntity | null>;
  abstract delete(id: string): Promise<void>;
  abstract countByPostId(postId: string): Promise<number>;
}

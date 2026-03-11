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
}

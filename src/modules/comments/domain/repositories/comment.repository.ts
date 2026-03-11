import { CommentEntity } from '../entities/comment.entity';

export abstract class CommentRepository {
  abstract save(comment: CommentEntity): Promise<void>;
  // We will add more methods here later for listing, updating, and deleting!
}

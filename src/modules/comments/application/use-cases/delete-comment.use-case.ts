import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { PostRepository } from '../../../posts/domain/repositories/post.repository';
import { UserEntity } from '../../../users/domain/entities/user.entity'; // Adjust path
import { PostNotFoundException } from 'src/modules/posts/domain/exceptions/post-not-found.exception';
import { CommentNotFoundException } from '../../domain/exceptions/comment-not-found.exception';
import { CannotDeleteCommentException } from '../../domain/exceptions/cannot-delete-comment.exception';

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
  ) {}

  public async execute(commentId: string, user: UserEntity): Promise<void> {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) throw new CommentNotFoundException(commentId); // 404

    const post = await this.postRepository.getPostById(comment.postId);
    if (!post) throw new PostNotFoundException(comment.postId); // 404

    // 👇 CHANGED: Look how clean this is now!
    if (!user.permissions.comments.canDelete(comment, post)) {
      throw new CannotDeleteCommentException(); // 403
    }

    await this.commentRepository.delete(commentId);
  }
}

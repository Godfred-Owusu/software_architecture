import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { UserRepository } from '../../../users/domain/repositories/user.repository';
import { PostRepository } from '../../../posts/domain/repositories/post.repository'; // 👈 1. Import PostRepo
import { CommentNotFoundException } from '../../domain/exceptions/comment-not-found.exception';
import { NotCommentAuthorException } from '../../domain/exceptions/not-comment-author.exception';

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository, // 👈 2. Inject it here
  ) {}

  public async execute(commentId: string, userId: string): Promise<void> {
    // 1. Find the comment
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) throw new CommentNotFoundException(commentId);

    // 👇 2. Find the Post (Because your business rules require it!)
    const post = await this.postRepository.getPostById(comment.postId);
    if (!post) throw new NotFoundException('Post not found'); // Or your PostNotFoundException

    // 3. Find the real user
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    // 👇 4. Pass BOTH the comment and the post to the permission checker!
    if (!user.permissions.comments.canDelete(comment, post)) {
      throw new NotCommentAuthorException();
    }

    // 5. Delete the comment
    await this.commentRepository.delete(commentId);
  }
}

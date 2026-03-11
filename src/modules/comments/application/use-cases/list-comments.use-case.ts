import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { PostRepository } from '../../../posts/domain/repositories/post.repository'; // Adjust path
import { UserRepository } from '../../../users/domain/repositories/user.repository'; // Adjust path
import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';
import { PostNotFoundException } from 'src/modules/posts/domain/exceptions/post-not-found.exception';

@Injectable()
export class ListCommentsUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(
    postId: string,
    page: number = 1,
    pageSize: number = 20,
    sortBy: string = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
  ): Promise<any> {
    // 1. Verify Post exists (Exam rule: 404 if not found)
    const post = await this.postRepository.getPostById(postId);
    if (!post) {
      throw new PostNotFoundException(postId);
    }

    // 2. Fetch comments and total count
    const [comments, total] = await this.commentRepository.findByPostId(
      postId,
      page,
      pageSize,
      sortBy,
      order,
    );

    // 3. Map over comments to fetch authors and format the output
    const formattedComments = await Promise.all(
      comments.map(async (comment) => {
        const author = await this.userRepository.getUserById(comment.authorId);
        const authorJson = author
          ? author.toJSON()
          : { id: comment.authorId, username: 'Unknown' };

        const commentJson = comment.toJSON();

        return {
          id: commentJson.id,
          postId: commentJson.postId,
          content: commentJson.content,
          author: {
            id: authorJson.id,
            username: authorJson.username,
          },
          createdAt: commentJson.createdAt,
          updatedAt: commentJson.updatedAt,
        };
      }),
    );

    // 4. Return the exact paginated structure requested by the exam
    return {
      comments: formattedComments,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
    };
  }
}

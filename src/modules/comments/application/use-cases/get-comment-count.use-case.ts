import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { PostRepository } from '../../../posts/domain/repositories/post.repository';
import { PostNotFoundException } from 'src/modules/posts/domain/exceptions/post-not-found.exception';

@Injectable()
export class GetCommentCountUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
  ) {}

  public async execute(postId: string): Promise<any> {
    const post = await this.postRepository.getPostById(postId);
    if (!post) throw new PostNotFoundException(postId); // 404

    const count = await this.commentRepository.countByPostId(postId);

    return {
      postId,
      count,
    };
  }
}

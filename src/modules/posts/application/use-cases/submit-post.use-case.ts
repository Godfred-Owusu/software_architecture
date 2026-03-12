import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { PostNotFoundException } from '../../domain/exceptions/post-not-found.exception';
import { CannotSubmitPostException } from '../../domain/exceptions/cannot-submit-post.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SubmitPostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(postId: string, user: UserEntity): Promise<any> {
    const post = await this.postRepository.getPostById(postId);
    if (!post) throw new PostNotFoundException(postId);

    if (!user.permissions.posts.canSubmitForReview(post)) {
      throw new CannotSubmitPostException();
    }

    post.submitForReview();

    // 👇 Use your exact repository method
    await this.postRepository.updatePost(postId, post);

    this.eventEmitter.emit('post.pending_review', { post });

    return post.toJSON();
  }
}

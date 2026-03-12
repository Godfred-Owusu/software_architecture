import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { PostNotFoundException } from '../../domain/exceptions/post-not-found.exception';
import { CannotApprovePostException } from '../../domain/exceptions/cannot-approve-post.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ApprovePostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(postId: string, user: UserEntity): Promise<any> {
    const post = await this.postRepository.getPostById(postId);
    if (!post) throw new PostNotFoundException(postId);

    if (!user.permissions.posts.canReview()) {
      throw new CannotApprovePostException();
    }

    post.approve();

    // 👇 Use your exact repository method
    await this.postRepository.updatePost(postId, post);

    this.eventEmitter.emit('post.approved', { post });

    return post.toJSON();
  }
}

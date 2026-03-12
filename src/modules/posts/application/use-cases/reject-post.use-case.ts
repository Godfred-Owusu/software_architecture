import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { PostNotFoundException } from '../../domain/exceptions/post-not-found.exception';
import { CannotRejectPostException } from '../../domain/exceptions/cannot-reject-post.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class RejectPostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(postId: string, user: UserEntity): Promise<any> {
    const post = await this.postRepository.getPostById(postId);
    if (!post) throw new PostNotFoundException(postId);

    if (!user.permissions.posts.canReview()) {
      throw new CannotRejectPostException();
    }

    post.reject();

    // 👇 Use your exact repository method
    await this.postRepository.updatePost(postId, post);

    this.eventEmitter.emit('post.rejected', { post });

    return post.toJSON();
  }
}

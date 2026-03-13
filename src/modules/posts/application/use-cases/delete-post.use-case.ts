import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostRepository } from '../../domain/repositories/post.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostNotFoundException } from '../../domain/exceptions/post-not-found.exception';

@Injectable()
export class DeletePostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(postId: string, userId: string): Promise<void> {
    // 1. Fetch the post FIRST
    const post = await this.postRepository.getPostById(postId);

    // 2. Handle the "undefined" case immediately [cite: 682, 685]
    if (!post) {
      throw new PostNotFoundException(postId);
    }

    // 3. Capture the data we need for the event BEFORE we delete it
    const postData = post.toJSON();
    const authorId = post.authorId;

    // 4. Perform the deletion [cite: 27, 119]
    await this.postRepository.deletePost(postId);

    // 5. Emit the event using the captured data [cite: 481-482, 660-662]
    this.eventEmitter.emit('post.deleted', {
      postId: post.id,
      title: postData.title,
      authorId: authorId,
      deletedByUserId: userId,
    });
  }
}

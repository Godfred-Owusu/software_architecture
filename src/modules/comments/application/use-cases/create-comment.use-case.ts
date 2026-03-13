import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { PostRepository } from '../../../posts/domain/repositories/post.repository';
import { UserRepository } from '../../../users/domain/repositories/user.repository';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { PostNotAcceptedException } from '../../domain/exceptions/post-not-accepted.exception';
import { UserNotFoundException } from '../../../users/domain/exceptions/user-not-found.exception';
import { PostNotFoundException } from 'src/modules/posts/domain/exceptions/post-not-found.exception';

@Injectable()
export class CreateCommentUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(
    postId: string,
    authorId: string,
    contentStr: string,
  ): Promise<any> {
    const post = await this.postRepository.getPostById(postId);
    if (!post) {
      throw new PostNotFoundException(postId);
    }

    if (post.status.toUpperCase() !== 'ACCEPTED') {
      throw new PostNotAcceptedException();
    }

    const author = await this.userRepository.getUserById(authorId);
    if (!author) {
      throw new UserNotFoundException(authorId);
    }

    const comment = CommentEntity.create(postId, authorId, contentStr);
    await this.commentRepository.save(comment);

    this.eventEmitter.emit('comment.created', {
      commentId: comment.id,
      postId: post.id,
      postTitle: post.toJSON().title,
      postAuthorId: post.authorId,
      commentAuthorId: author.id,
      commentAuthorUsername: author.toJSON().username,
    });

    const authorJson = author.toJSON();

    return {
      id: comment.id,
      postId: comment.postId,
      content: comment.toJSON().content,
      author: {
        id: authorJson.id,
        username: authorJson.username,
      },
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    };
  }
}

import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../domain/repositories/post.repository';
import { PostNotFoundException } from '../../domain/exceptions/post-not-found.exception';
import { SlugAlreadyInUseException } from '../../domain/exceptions/slug-already-in-use.exception';
import { UserCannotUpdatePostException } from '../../domain/exceptions/user-cannot-update-post.exception';
// 👇 1. Make sure to import your UserEntity! (Adjust the path if yours is located elsewhere)
import { UserEntity } from '../../../users/domain/entities/user.entity';

@Injectable()
export class UpdatePostSlugUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  // 👇 2. Add "user: UserEntity" right here!
  public async execute(
    postId: string,
    newSlug: string,
    user: UserEntity,
  ): Promise<any> {
    const post = await this.postRepository.getPostById(postId);

    if (!post) {
      throw new PostNotFoundException(postId);
    }

    // Now TypeScript knows what "user" is!
    if (post.authorId !== user.id && !user.hasRole('admin')) {
      throw new UserCannotUpdatePostException();
    }

    if (post.slug.toString() === newSlug) {
      return post.toJSON();
    }

    const isTaken = await this.postRepository.existsBySlug(newSlug);
    if (isTaken) {
      throw new SlugAlreadyInUseException(newSlug);
    }

    post.updateSlug(newSlug);

    await this.postRepository.updatePost(postId, post);

    return post.toJSON();
  }
}

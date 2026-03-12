import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { UserEntity } from '../../../users/domain/entities/user.entity'; // 👈 Import UserEntity
// For errors
import { PostNotFoundException } from '../../domain/exceptions/post-not-found.exception'; // Adjust path if needed

@Injectable()
export class UpdatePostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(
    id: string,
    input: UpdatePostDto,
    user: UserEntity,
  ): Promise<void> {
    this.loggingService.log('UpdatePostUseCase.execute');
    const post = await this.postRepository.getPostById(id);

    // 1. Fail fast with a 404 if the post doesn't exist
    if (!post) {
      throw new PostNotFoundException(id);
    }

    // 2. Enforce your business rule using your custom permissions!
    if (!user.permissions.posts.canUpdateContent(post)) {
      // throw new DomainException(
      //   'You can only update your own posts while they are drafts',
      //   'CANNOT_UPDATE_POST' // 👈 Make sure to map this to 403 in your exception filter
      // );
      throw new PostNotFoundException(id);
    }

    // 3. Update and save (keeping your exact logic)
    post.update(input.title, input.content);
    await this.postRepository.updatePost(id, post);
  }
}

import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostCreatedEvent } from '../../domain/events/post-created.event';
import { UserCannotCreatePostException } from '../../domain/exceptions/user-cannot-create-post.exception';
import { PostRepository } from '../../domain/repositories/post.repository';
import { CreatePostDto } from '../dtos/create-post.dto';
import { v4 } from 'uuid';

@Injectable()
// export class CreatePostUseCase {
//   constructor(
//     private readonly eventEmitter: EventEmitter2,
//     private readonly postRepository: PostRepository,
//   ) {}

//   public async execute(input: CreatePostDto, user: UserEntity): Promise<void> {
//     if (!user.permissions.posts.canCreate()) {
//       throw new UserCannotCreatePostException();
//     }

//     const post = PostEntity.create(input.title, input.content, input.authorId);

//     await this.postRepository.createPost(post);

//     this.eventEmitter.emit(PostCreatedEvent, {
//       postId: post.id,
//       authorId: input.authorId,
//     });
//   }
// }
export class CreatePostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  public async execute(
    input: { title: string; content: string; authorId: string; slug?: string },
    user: UserEntity,
  ): Promise<any> {
    // Extract the variables from the input object
    const { title, content, authorId, slug: customSlug } = input;

    // 1. Determine the base slug
    let baseSlug = customSlug ? this.slugify(customSlug) : this.slugify(title);

    // 2. Handle the edge case: Title was ONLY special characters (e.g. "!!!")
    if (!baseSlug) {
      baseSlug = `post-${v4().split('-')[0]}`;
    }

    // 3. Ensure it's not too long
    if (baseSlug.length > 90) {
      baseSlug = baseSlug.substring(0, 90).replace(/-$/, '');
    }

    // 4. Find a unique slug by checking the database
    const uniqueSlug = await this.generateUniqueSlug(baseSlug);

    // 5. Create the Domain Entity
    const post = PostEntity.create(title, content, authorId, uniqueSlug);

    // 6. Save to database
    await this.postRepository.createPost(post);

    return post.toJSON();
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace spaces/special chars with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
  }

  private async generateUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 2;

    // Keep looping and checking the DB until we find a slug that DOES NOT exist
    while (await this.postRepository.existsBySlug(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
}

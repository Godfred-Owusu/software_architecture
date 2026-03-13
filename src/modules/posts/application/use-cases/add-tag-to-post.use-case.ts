import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../domain/repositories/post.repository';
import { TagRepository } from '../../../tags/domain/repositories/tag.repository';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { PostNotFoundException } from '../../domain/exceptions/post-not-found.exception';
import { UserCannotModifyPostException } from '../../domain/exceptions/user-cannot-modify-post.exception';
import { TagNotFoundException } from 'src/modules/tags/domain/exceptions/tag-not-found.exception';

@Injectable()
export class AddTagToPostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  // 👇 Change return type to Promise<any> (or a specific return DTO/interface)
  async execute(postId: string, tagId: string, user: UserEntity): Promise<any> {
    // 1. Find the Post
    const post = await this.postRepository.getPostById(postId);
    if (!post) {
      throw new PostNotFoundException(postId);
    }

    // 2. Authorization Check
    if (!user.hasRole('admin') && post.authorId !== user.id) {
      throw new UserCannotModifyPostException(); // Swap with a more specific exception if you have one
    }

    // 3. Find the Tag to ensure it exists
    const tag = await this.tagRepository.findById(tagId);
    if (!tag) {
      throw new TagNotFoundException(tagId);
    }

    // 4. Update Domain Entity
    post.addTag(tagId);

    // 5. Save the updated Post
    await this.postRepository.updatePost(postId, post);

    // 👇 6. Build the exact response the project requires 👇
    // Fetch all the actual tag objects for the tags currently on the post
    const postTags = await Promise.all(
      post.tags.map((id) => this.tagRepository.findById(id)),
    );

    const postJson = post.toJSON();

    return {
      id: post.id,
      title: postJson.title,
      // Note: If you have a 'slug' in your PostEntity, map it here!
      // slug: postJson.slug,
      tags: postTags
        .filter((t) => t !== undefined) // safety check
        .map((t) => ({
          id: t!.id,
          name: t!.name.toString(), // Convert your TagName Value Object to string
        })),
    };
  }
}

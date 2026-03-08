import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../domain/repositories/post.repository';
import { TagRepository } from '../../../tags/domain/repositories/tag.repository';
import { UserEntity } from '../../../users/domain/entities/user.entity';

@Injectable()
export class AddTagToPostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  async execute(
    postId: string,
    tagId: string,
    user: UserEntity,
  ): Promise<void> {
    // 1. Find the Post
    const post = await this.postRepository.getPostById(postId);
    if (!post) {
      throw new Error(`Post with ID ${postId} not found`);
    }

    // 2. Authorization Check: Must be Admin OR Author
    if (!user.hasRole('admin') && post.authorId !== user.id) {
      throw new Error('User does not have permission to modify this post tags');
    }

    // 3. Find the Tag to ensure it's valid
    const tag = await this.tagRepository.findById(tagId);
    if (!tag) {
      throw new Error(`Tag with ID ${tagId} not found`); // Swap with TagNotFoundException
    }

    // 4. Update Domain Entity
    post.addTag(tagId);

    // 5. Save the updated Post
    await this.postRepository.updatePost(postId, post);
  }
}

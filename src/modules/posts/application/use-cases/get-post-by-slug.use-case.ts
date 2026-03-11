import { PostNotFoundException } from '../../domain/exceptions/post-not-found.exception';
import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UserRepository } from '../../../users/domain/repositories/user.repository';
import { TagRepository } from '../../../tags/domain/repositories/tag.repository';

import { UserEntity } from '../../../users/domain/entities/user.entity';
import { UserCannotViewPostException } from '../../domain/exceptions/user-cannot-view-post.exception';

@Injectable()
export class GetPostBySlugUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  // 👇 2. Add 'user' as a parameter (can be optional if guests can read posts)
  public async execute(slug: string, user?: UserEntity): Promise<any> {
    const post = await this.postRepository.getPostBySlug(slug);

    if (!post) {
      throw new PostNotFoundException(slug);
    }

    // 👇 3. THE MISSING RULE: 403 Forbidden for Drafts
    // Check if the post is NOT published (adjust 'accepted' to match your exact published status)
    if (post.status.toLowerCase() !== 'accepted') {
      // If there is no user logged in, OR the user is not the author AND not an admin -> BLOCK!
      if (!user || (post.authorId !== user.id && !user.hasRole('admin'))) {
        throw new UserCannotViewPostException();
      }
    }

    const author = await this.userRepository.getUserById(post.authorId);
    if (!author) {
      throw new Error(`Author with ID ${post.authorId} not found`);
    }

    const rawTags = await Promise.all(
      post.tags.map((tagId) => this.tagRepository.findById(tagId)),
    );
    const validTags = rawTags.filter((tag) => tag != null);

    const authorJson = author.toJSON();
    const postJson = post.toJSON();

    return {
      id: post.id,
      title: postJson.title,
      slug: post.slug.toString(),
      content: postJson.content,
      status: post.status.toUpperCase(),
      author: {
        id: author.id,
        username: authorJson.username,
      },
      tags: validTags.map((tag) => ({
        id: tag.id,
        name: tag.name.toString(),
      })),
      createdAt: post['createdAt'] || new Date().toISOString(),
      updatedAt: post['updatedAt'] || new Date().toISOString(),
      publishedAt: post.status === 'accepted' ? new Date().toISOString() : null,
    };
  }
}

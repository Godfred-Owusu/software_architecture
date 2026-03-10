// import { Injectable } from '@nestjs/common';
// import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
// import { PostEntity } from '../../domain/entities/post.entity';
// import { PostRepository } from '../../domain/repositories/post.repository';

// @Injectable()
// export class GetPostsUseCase {
//   constructor(
//     private readonly postRepository: PostRepository,
//     private readonly loggingService: LoggingService,
//   ) {}

//   public async execute(tags?: string[]): Promise<PostEntity[]> {
//     this.loggingService.log(
//       'GetPostsUseCase.execute with tags: ${tags || "none"}',
//     );
//     return this.postRepository.getPosts(tags);
//   }
// }

import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostRepository } from '../../domain/repositories/post.repository';
import { TagRepository } from '../../../tags/domain/repositories/tag.repository';
import { UserRepository } from '../../../users/domain/repositories/user.repository'; // Ensure this path is correct!
import { PostEntity } from '../../domain/entities/post.entity';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';

@Injectable()
export class GetPostsUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly tagRepository: TagRepository,
    private readonly userRepository: UserRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(
    tags?: string[],
    page: number = 1,
    pageSize: number = 20,
    user?: UserEntity | null,
  ): Promise<any> {
    this.loggingService.log('GetPostsUseCase.execute');

    // 👇 1. Cast the result so TypeScript knows 'posts' is definitely an array
    const [posts, total] = (await this.postRepository.getPosts(
      tags,
      page,
      pageSize,
      user,
    )) as [PostEntity[], number];

    const formattedPosts = await Promise.all(
      posts.map(async (post) => {
        const postJson = post.toJSON();

        const postTags = await Promise.all(
          (postJson.tags as string[]).map((id) =>
            this.tagRepository.findById(id),
          ),
        );

        // 👇 2. Use your exact method name: getUserById
        const author = await this.userRepository.getUserById(
          postJson.authorId as string,
        );

        // Convert the author to JSON so we can safely read its properties
        const authorJson = author ? author.toJSON() : null;

        return {
          id: postJson.id,
          title: postJson.title,
          slug:
            postJson.slug ||
            (postJson.title as string).toLowerCase().replace(/\s+/g, '-'),
          status: (postJson.status as string).toUpperCase(),
          author: {
            id: authorJson ? authorJson.id : postJson.authorId,
            // 👇 3. Replace 'email' with whatever property your User actually has (e.g., firstName)
            username: authorJson
              ? (authorJson as any).email || (authorJson as any).firstName
              : 'Unknown',
          },
          tags: postTags
            .filter((t) => t !== undefined)
            .map((t) => ({
              id: t!.id,
              name: t!.name.toString(),
            })),
          createdAt: postJson.createdAt || new Date().toISOString(),
          publishedAt: postJson.publishedAt || null,
        };
      }),
    );

    return {
      posts: formattedPosts,
      total: total,
      page: page,
      pageSize: pageSize,
    };
  }
}

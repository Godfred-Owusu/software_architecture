import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { PostEntity, PostStatus } from '../entities/post.entity';

// export type PostModel = {
//   id: string;
//   title: string;
//   content: string;
//   status: 'draft' | 'waiting_validation' | 'accepted' | 'rejected';
//   authorId: string;
// };

export type CreatePostModel = {
  title: string;
  content: string;
  authorId: string;
  status: PostStatus;
};

export type UpdatePostModel = Partial<CreatePostModel>;

export abstract class PostRepository {
  public abstract getPosts(
    tags?: string[],
    page?: number,
    pageSize?: number,
    user?: UserEntity | null,
  ): PostEntity[] | Promise<[PostEntity[], number]>;

  public abstract getPostById(
    id: string,
  ): PostEntity | undefined | Promise<PostEntity | undefined>;

  public abstract createPost(input: PostEntity): void | Promise<void>;

  public abstract updatePost(
    id: string,
    input: PostEntity,
  ): void | Promise<void>;

  public abstract deletePost(id: string): void | Promise<void>;

  public abstract getPostBySlug(slug: string): Promise<PostEntity | null>;

  public abstract existsBySlug(slug: string): Promise<boolean>;
}

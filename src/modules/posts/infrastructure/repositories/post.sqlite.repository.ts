import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostRepository } from '../../domain/repositories/post.repository';
import { SQLitePostEntity } from '../entities/post.sqlite.entity';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';

@Injectable()
export class SQLitePostRepository implements PostRepository {
  constructor(private readonly dataSource: DataSource) {}

  public async getPosts(
    tags?: string[],
    page: number = 1,
    pageSize: number = 20,
    user?: UserEntity | null,
  ): Promise<[PostEntity[], number]> {
    const skip = (page - 1) * pageSize;

    const tagFilter =
      tags && tags.length > 0 ? { tags: { name: In(tags) } } : {};

    let whereClause: any;

    if (user && (user.hasRole('admin') || user.hasRole('moderator'))) {
      whereClause = tagFilter;
    } else if (user) {
      // Authors see ACCEPTED posts OR their own posts (Draft, Rejected, etc.)
      whereClause = [
        { ...tagFilter, status: 'ACCEPTED' },
        { ...tagFilter, authorId: user.id },
      ];
    } else {
      // Guests (Non-authenticated) ONLY see ACCEPTED posts
      whereClause = { ...tagFilter, status: 'ACCEPTED' };
    }

    const [data, total] = await this.dataSource
      .getRepository(SQLitePostEntity)
      .findAndCount({
        where: whereClause,
        relations: ['tags'],
        skip: skip,
        take: pageSize,
      });

    const entities = data.map((post) => {
      const tagIds = post.tags ? post.tags.map((t) => t.id) : [];
      return PostEntity.reconstitute({ ...post, tags: tagIds });
    });

    return [entities, total];
  }

  public async getPostById(id: string): Promise<PostEntity | undefined> {
    const post = await this.dataSource
      .getRepository(SQLitePostEntity)
      .findOne({ where: { id }, relations: ['tags'] });

    if (!post) return undefined;

    const tagIds = post.tags ? post.tags.map((t) => t.id) : [];

    return PostEntity.reconstitute({ ...post, tags: tagIds });
  }

  // public async createPost(input: PostEntity): Promise<void> {
  //   await this.dataSource.getRepository(SQLitePostEntity).save(input.toJSON());
  // }

  public async createPost(input: PostEntity): Promise<void> {
    await this.savePost(input);
  }

  // public async updatePost(id: string, input: PostEntity): Promise<void> {
  //   await this.dataSource
  //     .getRepository(SQLitePostEntity)
  //     .update(id, input.toJSON());
  // }

  public async updatePost(id: string, input: PostEntity): Promise<void> {
    await this.savePost(input);
  }

  public async deletePost(id: string): Promise<void> {
    await this.dataSource.getRepository(SQLitePostEntity).delete(id);
  }

  private async savePost(input: PostEntity): Promise<void> {
    const json = input.toJSON();

    const tagObjects = (json.tags as string[]).map((tagId) => ({ id: tagId }));

    const ormPost = this.dataSource.getRepository(SQLitePostEntity).create({
      id: json.id as string,
      title: json.title as string,
      content: json.content as string,
      authorId: json.authorId as string,
      status: json.status as any,
      tags: tagObjects,
    });

    await this.dataSource.getRepository(SQLitePostEntity).save(ormPost);
  }
}

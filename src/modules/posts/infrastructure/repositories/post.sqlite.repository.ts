import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostRepository } from '../../domain/repositories/post.repository';
import { SQLitePostEntity } from '../entities/post.sqlite.entity';

@Injectable()
export class SQLitePostRepository implements PostRepository {
  constructor(private readonly dataSource: DataSource) {}

  public async getPosts(): Promise<PostEntity[]> {
    const data = await this.dataSource
      .getRepository(SQLitePostEntity)
      .find({ relations: ['tags'] });

    return data.map((post) => {
      // Map TypeORM Tag Objects -> Domain String IDs
      const tagIds = post.tags ? post.tags.map((t) => t.id) : [];
      return PostEntity.reconstitute({ ...post, tags: tagIds });
    });
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

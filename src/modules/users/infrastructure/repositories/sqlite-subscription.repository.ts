import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionRepository } from '../../../notifications/domain/repositories/subscription.repository';
import { SubscriptionEntity } from '../../../notifications/domain/entities/subscription.entity';
import { SQLiteSubscriptionEntity } from '../entities/sqlite-subscription.entity';
import { SQLiteUserEntity } from 'src/modules/users/infrastructure/entities/user.sqlite.entity'; // Adjust path if needed

@Injectable()
export class SqliteSubscriptionRepository implements SubscriptionRepository {
  constructor(
    @InjectRepository(SQLiteSubscriptionEntity)
    private readonly repository: Repository<SQLiteSubscriptionEntity>,
  ) {}

  public async save(subscription: SubscriptionEntity): Promise<void> {
    const sqliteSub = this.repository.create({
      followerId: subscription.followerId,
      followedId: subscription.followedId,
      followedAt: subscription.followedAt,
    });
    await this.repository.save(sqliteSub);
  }

  public async delete(followerId: string, followedId: string): Promise<void> {
    await this.repository.delete({ followerId, followedId });
  }

  public async isFollowing(
    followerId: string,
    followedId: string,
  ): Promise<boolean> {
    const count = await this.repository.count({
      where: { followerId, followedId },
    });
    return count > 0;
  }

  public async getFollowers(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<[any[], number]> {
    const skip = (page - 1) * pageSize;

    // 1. Build the base query (joins and filters)
    const queryBuilder = this.repository
      .createQueryBuilder('sub')
      .innerJoin(SQLiteUserEntity, 'user', 'user.id = sub.followerId')
      .where('sub.followedId = :userId', { userId });

    // 2. Get the total count based on the filters
    const total = await queryBuilder.getCount();

    // 3. Add the pagination, sorting, and raw selection, then fetch
    const rawResults = await queryBuilder
      .select([
        'user.id AS id',
        'user.username AS username',
        'sub.followedAt AS followedAt',
      ])
      .orderBy('sub.followedAt', 'DESC')
      .offset(skip)
      .limit(pageSize)
      .getRawMany();

    return [rawResults, total];
  }

  public async getFollowing(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<[any[], number]> {
    const skip = (page - 1) * pageSize;

    // 1. Build the base query
    const queryBuilder = this.repository
      .createQueryBuilder('sub')
      .innerJoin(SQLiteUserEntity, 'user', 'user.id = sub.followedId')
      .where('sub.followerId = :userId', { userId });

    // 2. Get the total count
    const total = await queryBuilder.getCount();

    // 3. Add the pagination, sorting, and raw selection, then fetch
    const rawResults = await queryBuilder
      .select([
        'user.id AS id',
        'user.username AS username',
        'sub.followedAt AS followedAt',
      ])
      .orderBy('sub.followedAt', 'DESC')
      .offset(skip)
      .limit(pageSize)
      .getRawMany();

    return [rawResults, total];
  }
}

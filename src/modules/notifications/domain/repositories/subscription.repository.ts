import { SubscriptionEntity } from '../entities/subscription.entity';
import { UserEntity } from '../../../users/domain/entities/user.entity';

export abstract class SubscriptionRepository {
  // Command methods
  public abstract save(subscription: SubscriptionEntity): Promise<void>;
  public abstract delete(followerId: string, followedId: string): Promise<void>;

  // Query methods
  public abstract isFollowing(
    followerId: string,
    followedId: string,
  ): Promise<boolean>;

  public abstract getFollowers(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<[any[], number]>;

  public abstract getFollowing(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<[any[], number]>;
}

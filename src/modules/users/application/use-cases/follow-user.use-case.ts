import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { SubscriptionRepository } from '../../../notifications/domain/repositories/subscription.repository';
import { SubscriptionEntity } from '../../../notifications/domain/entities/subscription.entity';
import { CannotFollowSelfException } from '../../../notifications/domain/exceptions/cannot-follow-self.exception';

@Injectable()
export class FollowUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  public async execute(followerId: string, followedId: string): Promise<any> {
    // 1. Cannot follow yourself
    if (followerId === followedId) {
      throw new CannotFollowSelfException(); // Maps to 400 Bad Request
    }

    // 2. Check if the target user actually exists
    const targetUser = await this.userRepository.getUserById(followedId);
    if (!targetUser) {
      throw new NotFoundException('Target user does not exist'); // Maps to 404
    }

    // 3. Idempotency check: Are we already following?
    const isFollowing = await this.subscriptionRepository.isFollowing(
      followerId,
      followedId,
    );

    let subscription: SubscriptionEntity;

    if (isFollowing) {
      // Exam allows idempotent behavior: just ignore and return success!
      subscription = SubscriptionEntity.create(followerId, followedId);
    } else {
      // Actually save it
      subscription = SubscriptionEntity.create(followerId, followedId);
      await this.subscriptionRepository.save(subscription);
    }

    return subscription.toJSON();
  }
}

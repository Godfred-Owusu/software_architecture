import { Injectable } from '@nestjs/common';
import { SubscriptionRepository } from '../../../notifications/domain/repositories/subscription.repository';

@Injectable()
export class UnfollowUserUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  public async execute(followerId: string, followedId: string): Promise<void> {
    // The exam says unfollowing when not following can be idempotent[cite: 461].
    // Our repository delete method handles this cleanly.
    await this.subscriptionRepository.delete(followerId, followedId);
  }
}

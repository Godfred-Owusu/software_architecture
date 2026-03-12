import { Injectable } from '@nestjs/common';
import { SubscriptionRepository } from '../../../notifications/domain/repositories/subscription.repository';

@Injectable()
export class GetFollowingUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  public async execute(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<any> {
    const [following, total] = await this.subscriptionRepository.getFollowing(
      userId,
      page,
      pageSize,
    );

    // Format matches the API contract exactly [cite: 550-561]
    return {
      following: following.map((f) => ({
        id: f.id,
        username: f.username,
        followedAt: new Date(f.followedAt).toISOString(),
      })),
      total,
      page,
      pageSize,
    };
  }
}

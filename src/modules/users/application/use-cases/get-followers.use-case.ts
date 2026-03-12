import { Injectable } from '@nestjs/common';
import { SubscriptionRepository } from '../../../notifications/domain/repositories/subscription.repository';

@Injectable()
export class GetFollowersUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  public async execute(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<any> {
    const [followers, total] = await this.subscriptionRepository.getFollowers(
      userId,
      page,
      pageSize,
    );

    // Format matches the API contract exactly [cite: 524-540]
    return {
      followers: followers.map((f) => ({
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

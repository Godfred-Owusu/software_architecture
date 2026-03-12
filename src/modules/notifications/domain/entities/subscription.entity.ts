export class SubscriptionEntity {
  private constructor(
    public readonly followerId: string,
    public readonly followedId: string,
    public readonly followedAt: Date,
  ) {}

  // Used when a user clicks "Follow"
  public static create(
    followerId: string,
    followedId: string,
  ): SubscriptionEntity {
    return new SubscriptionEntity(followerId, followedId, new Date());
  }

  // Used when pulling existing data from TypeORM
  public static reconstitute(
    followerId: string,
    followedId: string,
    followedAt: Date,
  ): SubscriptionEntity {
    return new SubscriptionEntity(followerId, followedId, followedAt);
  }

  public toJSON() {
    return {
      followerId: this.followerId,
      followedId: this.followedId,
      followedAt: this.followedAt.toISOString(),
    };
  }
}

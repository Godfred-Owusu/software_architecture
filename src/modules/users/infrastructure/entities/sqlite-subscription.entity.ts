import { Entity, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('subscriptions')
export class SQLiteSubscriptionEntity {
  @PrimaryColumn()
  followerId: string;

  @PrimaryColumn()
  followedId: string;

  @CreateDateColumn()
  followedAt: Date;
}

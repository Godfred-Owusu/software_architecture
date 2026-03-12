import { NotificationEntity } from '../entities/notification.entity';

export abstract class NotificationRepository {
  // Command methods
  public abstract save(notification: NotificationEntity): Promise<void>;
  public abstract saveMany(notifications: NotificationEntity[]): Promise<void>; // Useful for bulk sending to followers!

  // Update commands
  public abstract markAllAsRead(userId: string): Promise<number>; // Returns the count of marked items

  // Query methods
  public abstract findById(id: string): Promise<NotificationEntity | null>;

  public abstract getUserNotifications(
    userId: string,
    page: number,
    pageSize: number,
    isReadFilter: 'true' | 'false' | 'all',
  ): Promise<[NotificationEntity[], number]>; // Returns array of domain entities and total count

  public abstract getUnreadCount(userId: string): Promise<number>;
}

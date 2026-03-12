import { v4 as uuidv4 } from 'uuid';

export type NotificationType =
  | 'POST_PENDING_REVIEW'
  | 'POST_APPROVED'
  | 'POST_REJECTED'
  | 'POST_DELETED'
  | 'NEW_COMMENT'
  | 'NEW_POST_FROM_FOLLOWED';

export class NotificationEntity {
  private constructor(
    public readonly id: string,
    public readonly recipientId: string, // The user receiving the notification
    public readonly type: NotificationType,
    public readonly title: string,
    public readonly message: string,
    public readonly link: string,
    public isRead: boolean,
    public readonly metadata: Record<string, any>,
    public readonly createdAt: Date,
  ) {}

  // Used when a domain event triggers a new notification
  public static create(
    recipientId: string,
    type: NotificationType,
    title: string,
    message: string,
    link: string,
    metadata: Record<string, any> = {},
  ): NotificationEntity {
    return new NotificationEntity(
      uuidv4(), // Generate a new ID
      recipientId,
      type,
      title,
      message,
      link,
      false, // Always starts as unread
      metadata,
      new Date(),
    );
  }

  // Used when fetching from TypeORM
  public static reconstitute(
    id: string,
    recipientId: string,
    type: NotificationType,
    title: string,
    message: string,
    link: string,
    isRead: boolean,
    metadata: Record<string, any>,
    createdAt: Date,
  ): NotificationEntity {
    return new NotificationEntity(
      id,
      recipientId,
      type,
      title,
      message,
      link,
      isRead,
      metadata,
      createdAt,
    );
  }

  public markAsRead(): void {
    this.isRead = true;
  }

  public toJSON() {
    return {
      id: this.id,
      type: this.type,
      title: this.title,
      message: this.message,
      link: this.link,
      isRead: this.isRead,
      createdAt: this.createdAt.toISOString(),
      metadata: this.metadata,
    };
  }
}

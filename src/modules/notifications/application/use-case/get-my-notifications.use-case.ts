import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../../domain/repositories/notification.repository';

@Injectable()
export class GetMyNotificationsUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async execute(
    userId: string,
    page: number,
    pageSize: number,
    isRead: 'true' | 'false' | 'all',
  ) {
    const [notifications, total] =
      await this.notificationRepository.getUserNotifications(
        userId,
        page,
        pageSize,
        isRead,
      );
    const unreadCount =
      await this.notificationRepository.getUnreadCount(userId);

    return {
      notifications: notifications.map((n) => n.toJSON()),
      total,
      unreadCount,
      page,
      pageSize,
    };
  }
}

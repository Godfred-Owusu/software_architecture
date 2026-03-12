import { Injectable, ForbiddenException } from '@nestjs/common';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { NotificationNotFoundException } from '../../domain/exceptions/notification-not-found.exception';

@Injectable()
export class MarkNotificationAsReadUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async execute(notificationId: string, userId: string) {
    const notification =
      await this.notificationRepository.findById(notificationId);

    if (!notification) throw new NotificationNotFoundException(notificationId);
    if (notification.recipientId !== userId)
      throw new ForbiddenException('Not your notification');

    notification.markAsRead();
    await this.notificationRepository.save(notification);
    return notification.toJSON();
  }
}

import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../../domain/repositories/notification.repository';

@Injectable()
export class MarkAllNotificationsAsReadUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async execute(userId: string) {
    const markedCount = await this.notificationRepository.markAllAsRead(userId);
    return { markedCount };
  }
}

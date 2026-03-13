import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SQLiteNotificationEntity } from './infrastructure/entities/sqlite-notification.entity';
import { NotificationRepository } from './domain/repositories/notification.repository';
import { SqliteNotificationRepository } from './infrastructure/repositories/sqlite-notification.repository';
import { NotificationEventHandler } from './application/handlers/notification-event.handler';
import { UserModule } from '../users/user.module';
import { GetMyNotificationsUseCase } from './application/use-case/get-my-notifications.use-case';
import { MarkNotificationAsReadUseCase } from './application/use-case/mark-notification-as-read.use-case';
import { MarkAllNotificationsAsReadUseCase } from './application/use-case/mark-all-notifications-as-read.use-case';
import { NotificationController } from './infrastructure/controllers/notification.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SQLiteNotificationEntity]), UserModule],
  controllers: [NotificationController],
  providers: [
    {
      provide: NotificationRepository,
      useClass: SqliteNotificationRepository,
    },
    NotificationEventHandler,
    GetMyNotificationsUseCase,
    MarkNotificationAsReadUseCase,
    MarkAllNotificationsAsReadUseCase,
  ],
  exports: [NotificationRepository],
})
export class NotificationsModule {}

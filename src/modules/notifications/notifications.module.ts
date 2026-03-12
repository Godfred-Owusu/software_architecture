import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SQLiteNotificationEntity } from './infrastructure/entities/sqlite-notification.entity';
import { NotificationRepository } from './domain/repositories/notification.repository';
import { SqliteNotificationRepository } from './infrastructure/repositories/sqlite-notification.repository';
import { NotificationEventHandler } from './application/handlers/notification-event.handler';
import { UserModule } from '../users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([SQLiteNotificationEntity]), UserModule],
  providers: [
    {
      provide: NotificationRepository,
      useClass: SqliteNotificationRepository,
    },
    NotificationEventHandler,
  ],
  exports: [NotificationRepository],
})
export class NotificationsModule {}

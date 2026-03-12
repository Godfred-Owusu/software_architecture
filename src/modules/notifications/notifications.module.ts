import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SQLiteNotificationEntity } from './infrastructure/entities/sqlite-notification.entity';
import { NotificationRepository } from './domain/repositories/notification.repository';
import { SqliteNotificationRepository } from './infrastructure/repositories/sqlite-notification.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SQLiteNotificationEntity])],
  providers: [
    {
      provide: NotificationRepository,
      useClass: SqliteNotificationRepository,
    },
  ],
  exports: [NotificationRepository],
})
export class NotificationsModule {}

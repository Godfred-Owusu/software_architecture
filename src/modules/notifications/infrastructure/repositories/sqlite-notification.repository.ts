import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import {
  NotificationEntity,
  NotificationType,
} from '../../domain/entities/notification.entity';
import { SQLiteNotificationEntity } from '../entities/sqlite-notification.entity';

@Injectable()
export class SqliteNotificationRepository implements NotificationRepository {
  constructor(
    @InjectRepository(SQLiteNotificationEntity)
    private readonly repository: Repository<SQLiteNotificationEntity>,
  ) {}

  private toDomain(entity: SQLiteNotificationEntity): NotificationEntity {
    return NotificationEntity.reconstitute(
      entity.id,
      entity.recipientId,
      entity.type as NotificationType,
      entity.title,
      entity.message,
      entity.link,
      entity.isRead,
      entity.metadata,
      entity.createdAt,
    );
  }

  private toPersistence(domain: NotificationEntity): SQLiteNotificationEntity {
    const entity = new SQLiteNotificationEntity();
    entity.id = domain.id;
    entity.recipientId = domain.recipientId;
    entity.type = domain.type;
    entity.title = domain.title;
    entity.message = domain.message;
    entity.link = domain.link;
    entity.isRead = domain.isRead;
    entity.metadata = domain.metadata;
    entity.createdAt = domain.createdAt;
    return entity;
  }

  public async save(notification: NotificationEntity): Promise<void> {
    await this.repository.save(this.toPersistence(notification));
  }

  public async saveMany(notifications: NotificationEntity[]): Promise<void> {
    const entities = notifications.map((n) => this.toPersistence(n));
    await this.repository.save(entities);
  }

  public async findById(id: string): Promise<NotificationEntity | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  public async getUserNotifications(
    userId: string,
    page: number,
    pageSize: number,
    isReadFilter: 'true' | 'false' | 'all',
  ): Promise<[NotificationEntity[], number]> {
    const skip = (page - 1) * pageSize;
    const queryBuilder = this.repository
      .createQueryBuilder('notif')
      .where('notif.recipientId = :userId', { userId });

    // Apply the isRead filter based on the exam requirements
    if (isReadFilter === 'true') {
      queryBuilder.andWhere('notif.isRead = :isRead', { isRead: true });
    } else if (isReadFilter === 'false') {
      queryBuilder.andWhere('notif.isRead = :isRead', { isRead: false });
    }

    queryBuilder.orderBy('notif.createdAt', 'DESC').skip(skip).take(pageSize);

    const [entities, total] = await queryBuilder.getManyAndCount();
    return [entities.map((e) => this.toDomain(e)), total];
  }

  public async getUnreadCount(userId: string): Promise<number> {
    return this.repository.count({
      where: { recipientId: userId, isRead: false },
    });
  }

  public async markAllAsRead(userId: string): Promise<number> {
    const result = await this.repository.update(
      { recipientId: userId, isRead: false },
      { isRead: true },
    );
    return result.affected || 0;
  }
}

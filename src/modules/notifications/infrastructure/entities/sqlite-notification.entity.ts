import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('notifications')
export class SQLiteNotificationEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  recipientId: string;

  @Column()
  type: string;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column()
  link: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'simple-json' })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}

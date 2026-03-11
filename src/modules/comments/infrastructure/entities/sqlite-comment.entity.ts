import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comments')
export class SQLiteCommentEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  postId: string;

  @Column('uuid')
  authorId: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

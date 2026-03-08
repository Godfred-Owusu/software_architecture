import { SQLitePostEntity } from 'src/modules/posts/infrastructure/entities/post.sqlite.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';

@Entity('tags')
export class SQLiteTagEntity {
  @PrimaryColumn('uuid')
  id: string;

  // The business rule says tags must be unique and max 50 chars!
  @Column({ unique: true, length: 50 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => SQLitePostEntity, (post) => post.tags)
  posts: SQLitePostEntity[];
}

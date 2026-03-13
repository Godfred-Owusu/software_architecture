import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import type { PostStatus } from '../../domain/entities/post.entity';
import { SQLiteTagEntity } from 'src/modules/tags/infrastructure/entities/tag.sqlite.entity';

@Entity('posts')
export class SQLitePostEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'status', type: 'varchar', default: 'pending_review' })
  status: string;
  @Column()
  authorId: string;

  @ManyToMany(() => SQLiteTagEntity, (tag) => tag.posts, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'post_tags',
    joinColumn: { name: 'postId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: SQLiteTagEntity[];
}

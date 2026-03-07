import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('tags')
export class SQLiteTagEntity {
  @PrimaryColumn('uuid')
  id: string;

  // The business rule says tags must be unique and max 50 chars!
  @Column({ unique: true, length: 50 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;
}

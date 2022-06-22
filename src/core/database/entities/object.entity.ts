import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class ObjectEntityWithoutPrimaryKey extends BaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}

export abstract class ObjectEntity extends ObjectEntityWithoutPrimaryKey {
  @PrimaryGeneratedColumn('uuid') id: string;
}

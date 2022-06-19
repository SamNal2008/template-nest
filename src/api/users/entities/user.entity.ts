import { Exclude } from 'class-transformer';
import { UserTheme } from '../utils/enums/user.enum';
import { ObjectEntity } from '../../../core/database/entities/object.entity';
import { Column, Entity } from 'typeorm';

@Entity({
  orderBy: {
    createdAt: 'ASC',
  },
})
export class User extends ObjectEntity {
  @Column({ nullable: false })
  userName: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  password: string;

  @Column({
    nullable: false,
    default: UserTheme.DARK,
    type: 'enum',
    enum: UserTheme,
  })
  theme: UserTheme;

  @Column({
    nullable: false,
    default: false,
    type: 'boolean',
  })
  isGoogleAuth: boolean;
}

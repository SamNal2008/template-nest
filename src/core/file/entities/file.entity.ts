import { ObjectEntity } from '../../database/entities/object.entity';
import { Column, Entity } from 'typeorm';
import { MimeTypeEnum } from '../utils/enums/mime-types.enum';

@Entity()
export class FileEntity extends ObjectEntity {
  @Column()
  url: string;

  @Column()
  key: string;

  @Column({ enum: MimeTypeEnum, type: 'simple-enum', nullable: true })
  mimeType: MimeTypeEnum;
}

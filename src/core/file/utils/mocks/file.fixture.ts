import { FileEntity } from '../../entities/file.entity';
import { RandomGeneratorFactory } from '../../../utils/functions/random-generator-factory';
import { MimeTypeEnum } from '../enums/mime-types.enum';
import { PartialType } from '@nestjs/mapped-types';

export class WithPropertiesForFile extends PartialType(FileEntity) {}

const generateNewFileEntity = (
  withProperties?: WithPropertiesForFile,
): FileEntity => {
  return {
    url: withProperties?.url
      ? withProperties.url
      : RandomGeneratorFactory.url('aws-s3'),
    id: withProperties?.id ? withProperties.id : RandomGeneratorFactory.UUID(),
    key: withProperties?.key
      ? withProperties.key
      : RandomGeneratorFactory.string(),
    updatedAt: withProperties?.updatedAt
      ? withProperties.updatedAt
      : RandomGeneratorFactory.date(),
    createdAt: withProperties?.createdAt
      ? withProperties.createdAt
      : RandomGeneratorFactory.date(),
    isActive: withProperties?.isActive
      ? withProperties.isActive
      : RandomGeneratorFactory.boolean(),
    mimeType: withProperties?.mimeType
      ? withProperties.mimeType
      : RandomGeneratorFactory.randomEnum(MimeTypeEnum),
  } as FileEntity;
};

export const files: FileEntity[] = [
  generateNewFileEntity(),
  generateNewFileEntity(),
  generateNewFileEntity(),
  generateNewFileEntity(),
  generateNewFileEntity(),
];

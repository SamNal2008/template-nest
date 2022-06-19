import { MimeTypeEnum } from '../enums/mime-types.enum';
import { FileEntity } from '../../entities/file.entity';

export const MCDONALDS_PICTURE = {
  id: 'PictureId1',
  isActive: true,
  mimeType: MimeTypeEnum.PNG,
  key: 'picture-mcdo.png',
  url:
    's3//template-nest/picture-mcdo.png',
} as FileEntity;

export const JEWELER_PICTURE = {
  id: 'PictureId2',
  isActive: true,
  mimeType: MimeTypeEnum.JPEG,
  key: 'picture-bijou.jpeg',
  url:
    's3//template-nest/picture2.jpeg',
} as FileEntity;

export const FILE_DATA: FileEntity[] = [MCDONALDS_PICTURE, JEWELER_PICTURE];

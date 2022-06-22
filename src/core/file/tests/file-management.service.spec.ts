import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { FileManagementService } from '../file-management.service';
import { IGetSignedUrl } from '../file-management-type';
import { IStorageFileConfiguration } from '../../utils/interfaces/configuration.interface';
import { FileEntity } from '../entities/file.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { when } from 'jest-when';
import { MimeTypeEnum } from '../utils/enums/mime-types.enum';
import spyOn = jest.spyOn;
import { HttpStatus } from '@nestjs/common';

describe('FileManagementService', () => {
  let service: FileManagementService;

  const mockConfig: IStorageFileConfiguration = {
    accessKeyId: 'key',
    region: 'eu-west-3',
    secretAccessKey: 'secret',
    bucket: {
      name: 'name',
    },
  };

  const mockedConfigService = {
    get: jest.fn(),
  };
  const mockS3 = {
    upload: jest.fn(),
    signedUrl: jest.fn(),
    delete: jest.fn(),
  };

  when(mockedConfigService.get)
    .calledWith('storage.file')
    .mockReturnValue(mockConfig);

  const repositoryMockFactory = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileManagementService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: getRepositoryToken(FileEntity),
          useValue: repositoryMockFactory,
        },
      ],
    }).compile();
    service = module.get<FileManagementService>(FileManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Upload object', () => {
    when(repositoryMockFactory.create).calledWith().mockReturnValue({
      id: '',
      isActive: true,
    });

    it('should not upload object if no path is provided', async () => {
      const emptyFile = new FileEntity();
      emptyFile.id = null;
      emptyFile.isActive = false;
      expect(
        await service.uploadObject(null, { path: '' } as Express.Multer.File),
      ).toEqual(emptyFile);
    });

    it('should not upload object if path is empty', async () => {
      const emptyFile = new FileEntity();
      emptyFile.id = null;
      emptyFile.isActive = false;
      expect(
        await service.uploadObject('', { path: '' } as Express.Multer.File),
      ).toEqual(emptyFile);
    });

    it('should not upload object if file is null', async () => {
      const emptyFile = new FileEntity();
      emptyFile.id = null;
      emptyFile.isActive = false;
      expect(await service.uploadObject('path', null)).toEqual(emptyFile);
    });

    it('should create a file and upload it', async () => {
      const buffer = Buffer.from('ok');
      const fileToUpload: Express.Multer.File = {
        path: 'path',
        buffer: buffer,
        mimetype: MimeTypeEnum.PNG,
        originalname: 'originalName.png',
      } as Express.Multer.File;

      const spyOnFileSave = spyOn(repositoryMockFactory, 'save');
      const path = 'path';
      service.s3.upload = mockS3.upload;
      mockS3.upload.mockReturnValue({
        promise: () =>
          Promise.resolve({
            Key: '',
            Bucket: '',
            Location: '',
            Etag: '',
          }),
      });
      await service.uploadObject(path, fileToUpload);
      expect(service.s3.upload).toHaveBeenCalled();
      expect(spyOnFileSave).toHaveBeenCalled();
    });
  });

  describe('Get signed url', () => {
    it('should get a signed url for an object', async () => {
      const fileId = '1';
      const keyId = 'key';
      repositoryMockFactory.findOne.mockResolvedValue({
        id: fileId,
        key: keyId,
      });
      service.s3.getSignedUrl = mockS3.signedUrl;
      const responseExpected = 'signedUrl';
      mockS3.signedUrl.mockReturnValue(responseExpected);
      const callGetSignedUrl: IGetSignedUrl = await service.getSignedUrl(
        fileId,
      );
      expect(callGetSignedUrl.isSuccess).toBeTruthy();
      expect(callGetSignedUrl.signedUrl).toEqual(responseExpected);
    });

    it('should fail to get signed url if object does not exist', async () => {
      const unknownFilePath = 'no-file';
      repositoryMockFactory.findOne.mockResolvedValue(null);
      const callGetSignedUrl = await service.getSignedUrl(unknownFilePath);
      expect(callGetSignedUrl.isSuccess).toBeFalsy();
      expect(callGetSignedUrl.errorMessage).toMatch(
        'The file you are looking for does not exist',
      );
    });
  });

  describe('Delete object', () => {
    it('should delete a file correctly', async () => {
      const fileId = '1';
      const fileKey = 'key';
      repositoryMockFactory.findOne.mockReturnValue({
        id: fileId,
        key: fileKey,
      });
      service.s3.deleteObject = mockS3.delete;
      mockS3.delete.mockReturnValue({
        promise: () => Promise.resolve({$response: {httpResponse: {statusCode: HttpStatus.NO_CONTENT}}}),
      });
      const callDeleteObject = await service.deleteObject(fileId);
      expect(repositoryMockFactory.remove).toHaveBeenCalled();
      expect(callDeleteObject).toBeDefined();
      expect(callDeleteObject).toBeTruthy();
    });

    it('should fail to delete the file already deleted', async () => {
      const fileId = 'invalid id';
      repositoryMockFactory.findOne.mockResolvedValue(null);
      const callDeleteObject = await service.deleteObject(fileId);
      expect(callDeleteObject).toBeFalsy();
    });
  });
});

import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { IGetSignedUrl } from './file-management-type';
import { Repository } from 'typeorm';
import { FileEntity } from './entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as mime from 'mime';
import * as path from 'path';
import { MimeTypeEnum } from './utils/enums/mime-types.enum';
import { IStorageFileConfiguration } from '../utils/interfaces/configuration.interface';

@Injectable()
export class FileManagementService {
  public static STORAGE_PREFIX = {
    userData: 'user_data',
  };
  public s3: S3;
  private readonly logger: Logger = new Logger(FileManagementService.name);
  private readonly bucketName: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {
    const fileConfigStorage =
      this.configService.get<IStorageFileConfiguration>('storage.file');
    this.bucketName = fileConfigStorage.bucket.name;
    this.s3 = new S3();
  }

  /** public async beforeApplicationShutdown(signal?: string): Promise<boolean> {
    if (this.configService.get("app.node_env") !== ENodeEnv.DEVELOPMENT)
      return false;
    if (signal !== 'SIGINT') return false;
    this.logger.log(
      `Application shutting down (${signal}), removing all files`,
    );
    // return this.deleteAllFilesFromDatabaseAndS3();
  } */

  public async deleteAllFilesFromDatabaseAndS3(): Promise<boolean> {
    try {
      const files = await this.fileRepository.find();
      for (const file of files) {
        this.logger.debug(`Removing file : ${file.id}`);
        (await this.deleteObject(file.id))
          ? this.logger.log(`File : ${file.id} deleted`)
          : this.logger.warn(`File ${file.id} could not be deleted`);
      }
      return true;
    } catch (exception) {
      this.logger.error(
        'An error has occurred while deleting files' + exception,
      );
      return false;
    }
  }

  /**
   * Store object with a relative path (s3Name://path/to/object)
   * and the current object to store
   * @param {string} filePath Relative path on s3
   * @param {Express.Multer.File} file Object to store
   * @returns {Promise<boolean>} true if file is stored false otherwise
   */
  async uploadObject(
    filePath: string,
    file: Express.Multer.File,
  ): Promise<FileEntity> {
    const emptyFile = this.fileRepository.create();
    emptyFile.id = null;
    emptyFile.isActive = false;
    if (!filePath || !file) {
      this.logger.warn('Invalid path for uploading file');
      return emptyFile;
    }
    try {
      const uploadedResult = await this.s3
        .upload({
          Bucket: this.bucketName,
          Body: file.buffer,
          Key: filePath,
        })
        .promise();
      let targetMimeType: MimeTypeEnum;
      if (!file.mimetype || file.mimetype === 'application/octet-stream') {
        const fileExtension = path.extname(file.originalname);
        targetMimeType = (mime.getType(fileExtension) ??
          'application/octet-stream') as MimeTypeEnum;
      } else {
        targetMimeType = file.mimetype as MimeTypeEnum;
      }

      const newFile = this.fileRepository.create({
        key: uploadedResult.Key,
        url: uploadedResult.Location,
        mimeType: targetMimeType,
      });

      return this.fileRepository.save(newFile);
    } catch (err) {
      this.logger.error(err);
      return emptyFile;
    }
  }

  /**
   * Get signed url from bucket
   * to display it on a website
   * @param {string} fileId
   * @returns {Promise<IGetSignedUrl>} signedUrl
   */
  async getSignedUrl(fileId: string): Promise<IGetSignedUrl> {
    const wantedFile = await this.fileRepository.findOne({
      where: { id: fileId },
    });
    this.logger.debug(`Looking for file with ID : ${fileId}`);

    if (!wantedFile) {
      this.logger.warn(`File with ID : ${fileId} does not exist`);

      return {
        isSuccess: false,
        errorMessage: 'The file you are looking for does not exist',
      };
    }
    try {
      const res = this.s3.getSignedUrl('getObject', {
        Bucket: this.bucketName,
        Key: wantedFile.key,
        Expires: 5000,
      });
      this.logger.debug(res);
      return {
        isSuccess: true,
        signedUrl: res,
      };
    } catch (error) {
      this.logger.error(error);
      return {
        isSuccess: false,
        errorMessage: error.statusCode,
      };
    }
  }

  /**
   * Delete object on S3
   * @param {string} fileId relative path to object
   * @returns {Promise<boolean>} Delete result of AWS-S3 (true if file deleted error otherwise)
   */
  async deleteObject(fileId: string): Promise<boolean> {
    const file = await this.fileRepository.findOne({ where: { id: fileId } });
    if (!file) {
      this.logger.warn(`File with id : ${fileId} not found`);
      return false;
    }
    const res = await this.s3
      .deleteObject({
        Bucket: this.bucketName,
        Key: file.key,
      })
      .promise();
    if (res.$response.httpResponse.statusCode === HttpStatus.NO_CONTENT) {
      await this.fileRepository.remove(file);
      return true;
    }
    return false;
  }
}

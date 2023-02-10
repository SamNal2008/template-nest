import { Injectable } from '@nestjs/common';
import { FileManagementService } from './core/file/file-management.service';
import { DatabaseService } from './core/database/database.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private readonly fileManagementService: FileManagementService,
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
  ) {}

  getHello(): string {
    return (
      'Hello World! : ' + this.configService.get('JWT_REFRESH_EXPIRATION_TIME')
    );
  }

  async clearDatabase(): Promise<void> {
    await this.fileManagementService.deleteAllFilesFromDatabaseAndS3();
    await this.databaseService.dropDatabase();
  }

  async fillDatabase(): Promise<void> {
    await this.databaseService.fillDatabase();
    return;
  }
}

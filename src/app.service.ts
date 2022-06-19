import { Injectable } from '@nestjs/common';
import { FileManagementService } from './core/file/file-management.service';
import { DatabaseService } from './core/database/database.service';

@Injectable()
export class AppService {
  constructor(
    private readonly fileManagementService: FileManagementService,
    private readonly databaseService: DatabaseService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async clearDatabase(): Promise<void> {
    await this.fileManagementService.deleteAllFilesFromDatabaseAndS3();
    await this.databaseService.dropDatabase();
    return;
  }

  async fillDatabase(): Promise<void> {
    await this.databaseService.fillDatabase();
    return;
  }
}

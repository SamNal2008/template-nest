import { Module } from '@nestjs/common';
import { ProjectConfigModule } from './config/project-config.module';
import { DatabaseModule } from './database/database.module';
import { SecurityModule } from './security/security.module';
import { FileModule } from './file/file.module';
import { MailModule } from './mail/mail.module';
import { ProjectCacheModule } from './project-cache/project-cache.module';

@Module({
  imports: [
    ProjectConfigModule,
    DatabaseModule,
    SecurityModule,
    FileModule,
    MailModule,
    ProjectCacheModule,
  ],
  exports: [DatabaseModule, FileModule],
})
export class CoreModule {}

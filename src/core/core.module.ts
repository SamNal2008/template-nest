import { Module } from '@nestjs/common';
import { ProjectConfigModule } from './config/project-config.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ProjectConfigModule, DatabaseModule]
})
export class CoreModule {}

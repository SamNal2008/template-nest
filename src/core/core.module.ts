import { Module } from '@nestjs/common';
import { ProjectConfigModule } from './config/project-config.module';
import { DatabaseModule } from './database/database.module';
import { ServiceModule } from './services/services.module';

@Module({
  imports: [ProjectConfigModule, DatabaseModule, ServiceModule],
})
export class CoreModule {}

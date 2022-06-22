import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { FileManagementService } from './file-management.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [FileManagementService],
  exports: [FileManagementService, TypeOrmModule],
})
export class FileModule {}

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import { FileModule } from '../../core/file/file.module';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    FileModule,
    AccountModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}

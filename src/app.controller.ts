import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './core/security/security.module';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('clear-database')
  async clearDatabase(): Promise<void> {
    return this.appService.clearDatabase();
  }

  @Public()
  @Get('fill-database')
  async fillDatabase(): Promise<void> {
    return this.appService.fillDatabase();
  }
}

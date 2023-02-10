import { Controller, Get, Param, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './core/security/security.module';
import { BehaviorSubject, filter, tap } from 'rxjs';

@Controller('/:id')
export class AppController {
  private readonly subject = new BehaviorSubject({ data: { hello: 'world' } });

  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(@Param('id') id: string): string {
    this.subject.next({ data: { hello: id } });
    return this.appService.getHello();
  }

  @Sse('/sse')
  @Public()
  sseTest(@Param('id') id: string): any {
    let count2 = 0;
    return this.subject.asObservable().pipe(
      filter((value) => value.data.hello === id),
      tap((data) => {
        console.log(data);
        console.log(count2++);
      }),
    );
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

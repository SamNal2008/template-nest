import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './core/interceptors/logging.interceptor';
import { detailLogger } from './core/middleware/detail-logging.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose']
  });

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.use(detailLogger);

  const appConfig = app.get(ConfigService).get('app');

  await app.listen(appConfig.port);
}
bootstrap();

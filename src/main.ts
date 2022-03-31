import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './core/interceptors/exception.interceptor';
import { detailLogger } from './core/middleware/detail-logging.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'log', 'verbose', 'warn'],
  });

  const appConfig = app.get(ConfigService).get('app');

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.use(detailLogger);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(appConfig.port);
}
bootstrap();

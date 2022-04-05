import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoggingInterceptor } from './core/interceptors/exception.interceptor';
import { detailLogger } from './core/middleware/detail-logging.middleware';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const appConfig = app.get(ConfigService).get('app');
  app.useLogger(appConfig.logLevel);
  const config = new DocumentBuilder()
    .setTitle(appConfig.documentation.title)
    .setDescription(appConfig.documentation.description)
    .setVersion(appConfig.documentation.version)
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.use(detailLogger);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(appConfig.port);
}
bootstrap();

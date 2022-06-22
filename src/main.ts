import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionInterceptor } from './core/interceptors/global-exception-interceptor.service';
import { detailLogger } from './core/middleware/detail-logging.middleware';

async function bootstrap(): Promise<void> {
  /**
   * App start up configuration
   */
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');

  /**
   * Get app configuration
   */
  const appConfig = app.get(ConfigService).get('app');
  app.useLogger(appConfig.logLevel);

  /**
   * Documentation configuration
   */
  const config = new DocumentBuilder()
    .setTitle(appConfig.documentation.title)
    .setDescription(appConfig.documentation.description)
    .setVersion(appConfig.documentation.version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'JWT',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  /**
   * App Interceptors
   */
  app.useGlobalInterceptors(new GlobalExceptionInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  /**
   * App Logger
   */
  app.use(detailLogger);

  /**
   * App Validation Pipe to transform DTOs
   */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      always: true,
      forbidUnknownValues: false,
      whitelist: false,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
      stopAtFirstError: true,
    }),
  );

  /**
   * App Config for before and after app hooks
   */
  // app.enableShutdownHooks();

  /**
   * App Start-up
   */
  await app.listen(appConfig.port);
}

bootstrap().then((startedUp) => startedUp);

import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration from './configuration';
import * as Joi from 'joi';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'staging')
          .default('production'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        LOG_LEVEL: Joi.string()
          .valid('error', 'log', 'debug', 'warn', 'verbose')
          .default('log'),
        DOC_TITLE: Joi.string().default('').optional(),
        DOC_DESC: Joi.string().optional().default(''),
        DOC_VERSION: Joi.string().optional().default(''),
        GOOGLE_TOKEN_URI: Joi.string().required(),
        GOOGLE_AUTH_URI: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_REDIRECT_URI: Joi.string().required(),
        HASH_SALT: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRATION_TIME: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_REGION: Joi.string().required().valid('eu-west-3'),
        AWS_BUCKET_NAME: Joi.string().required(),
        CACHE_HOST: Joi.string().required(),
        CACHE_PORT: Joi.number().required(),
        CACHE_TTL: Joi.number().default(1000),
      }),
      envFilePath: ['.env'],
      expandVariables: true,
    }),
  ],
})
export class ProjectConfigModule {}

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
        LOG_LEVEL: Joi.string().valid('error', 'log','debug', 'warn', 'verbose').default('info'),
        DOC_TITLE: Joi.string().default('').optional(),
        DOC_DESC: Joi.string().optional().default(''),
        DOC_VERSION: Joi.string().optional().default('')
      }),
      envFilePath: ['.env'],
      expandVariables: true,
    }),
  ],
})
export class ProjectConfigModule {}

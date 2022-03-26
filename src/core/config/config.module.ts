import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration from './configuration.dev';
import * as Joi from 'joi';


@Module({
  imports: [NestConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
    validationSchema: Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision')
        .default('development'),
      PORT: Joi.number().default(3000),
    }),
    envFilePath: ['.env.local'],
  })]
})
export class ConfigModule {}

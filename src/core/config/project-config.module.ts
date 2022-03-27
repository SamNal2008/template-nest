import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration from './configuration';
import * as Joi from 'joi';


@Module({
  imports: [NestConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
    validationSchema: Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'staging')
        .default('production'),
      PORT: Joi.number().default(3000),
      DATABASE_URL: Joi.string().required()
    }),
    envFilePath: ['.env.local'],
  })]
})
export class ProjectConfigModule {}

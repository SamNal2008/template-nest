import {
  ENodeEnv,
  IConfiguration,
} from '../utils/interfaces/configuration.interface';
import { LogLevel } from '@nestjs/common';

export default (): IConfiguration => ({
  app: {
    port: process.env.PORT || 3000,
    node_env: process.env.NODE_ENV || ENodeEnv.DEVELOPMENT,
    documentation: {
      title: process.env.DOC_TITLE,
      description: process.env.DOC_DESC,
      version: process.env.DOC_VERSION,
    },
    logLevel: process.env.LOG_LEVEL as LogLevel,
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  auth: {
    hash: process.env.HASH_SALT,
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authUri: process.env.GOOGLE_AUTH_URI,
      tokenUri: process.env.GOOGLE_TOKEN_URI,
      redirectUri: process.env.GOOGLE_REDIRECT_URI,
    },
    jwt: {
      accessToken: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      },
      refreshToken: {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
      },
    },
  },
  storage: {
    file: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      bucket: {
        name: process.env.AWS_BUCKET_NAME,
      },
    },
    cache: {
      host: process.env.CACHE_HOST,
      port: process.env.CACHE_PORT,
      ttl: process.env.CACHE_TTL,
    },
  },
});

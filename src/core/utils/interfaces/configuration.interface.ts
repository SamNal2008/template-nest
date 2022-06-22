import { LogLevel } from '@nestjs/common';

export enum ENodeEnv {
  DEVELOPMENT = 'development',
  TEST = 'test',
  STAGINGG = 'staging',
  PROD = 'prod',
}

export interface IDocumentationConfiguration {
  title: string;
  description: string;
  version: string;
}

export interface IAppConfiguration {
  port: string | number;
  node_env: string | ENodeEnv;
  documentation: IDocumentationConfiguration;
  logLevel: LogLevel;
}

export interface IDatabaseConfiguration {
  url: string;
}

export interface ITokenConfiguration {
  secret: string;
  expiresIn: string;
}

export interface IAuthConfiguration {
  hash: string;
  google: {
    clientId: string;
    clientSecret: string;
    authUri: string;
    tokenUri: string;
    redirectUri: string;
  };
  jwt: {
    accessToken: ITokenConfiguration;
    refreshToken: ITokenConfiguration;
  };
}

export interface IStorageFileConfiguration {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: {
    name: string;
  };
}

export interface IStorageConfiguration {
  file: IStorageFileConfiguration;
  cache: {
    host: string;
    port: string;
    ttl: string;
  };
}

export interface IConfiguration {
  app: IAppConfiguration;
  database: IDatabaseConfiguration;
  auth: IAuthConfiguration;
  storage: IStorageConfiguration;
}

import { Test, TestingModule } from '@nestjs/testing';
import {
  CacheModule,
  ExecutionContext,
  INestApplication,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/api/authentication/utils/guards/jwt-auth.guard';
import { GqlExecutionContext } from '@nestjs/graphql';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll((done) => {
    done();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: CacheModule,
          useValue: {},
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const ctx = GqlExecutionContext.create(context);
          ctx.getContext().req.user = { id: '1' };
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll((done) => {
    app.close().then(() => done());
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/companies?limit=10&page=1&search=111')
      .expect(200)
      .expect('Hello World!');
  });
});

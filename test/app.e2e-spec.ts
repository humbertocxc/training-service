import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { App } from 'supertest/types';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    type _Chain = {
      get(path: string): { expect(codeOrBody: number | string): any };
    };

    const server = app.getHttpServer();
    const chain = request(server as unknown as App) as unknown as _Chain;
    return chain.get('/').expect(200).expect('Hello World!');
  });
});

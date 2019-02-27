const routePath = './src/server/interfaces/http';
const makeCamel = require('./utils');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = function generateRouteTest(component, domain) {
  let camel = makeCamel(domain);
  let upper = camel[0].toUpperCase() + camel.slice(1, camel.length);

  const content = `import request from 'supertest';
  import { testHelper } from '@root/test/testHelper';
  import express from 'express';
  
  describe('${upper} route test', () => {
    let app: express.Express;
    beforeAll(() => {
      return testHelper.getApp().then(_app => {
        app = _app;
      });
    });
    describe('POST: /${domain}s', () => {
      it('success', async () => {
        let res = await request(app).post('/api/v1/${domain}s');
      });
    });
    describe('GET: /${domain}s', () => {
      it('success', async () => {
        let res = await request(app).get('/api/v1/${domain}s');
      });
    });
    describe('PUT: /${domain}s', () => {
      it('success', async () => {
        let res = await request(app).put('/api/v1/${domain}s');
      });
    });
    describe('DELETE: /${domain}s', () => {
      it('success', async () => {
        let res = await request(app).delete('/api/v1/${domain}s');
      });
    });
  });
  `;
  mkdirp.sync(`${routePath}`);
  fs.writeFileSync(`${routePath}/${domain}.route.test.ts`, content);
};

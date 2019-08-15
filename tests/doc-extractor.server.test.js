/* eslint-env node, mocha */
/* eslint-disable import/no-dynamic-require */
const request = require('supertest');
const { resolve, basename } = require('path');
const { expect } = require('chai');
const mongoose = require('mongoose');

const { createUser } = require(resolve('helpers/utils'));

const {
  it, before, describe, afterEach,
} = require('mocha');

const express = require(resolve('./config/lib/express'));
const { prefix } = require(resolve('config'));

const User = mongoose.model('User');
const moduleName = basename(resolve(__dirname, '..'));

/**
 * Globals
 */
let app;
let agent;
const credentials = {
  username: 'username',
  password: 'M3@n.jsI$Aw3$0m3',
};

/**
 * Sections tests
 */
describe('Controllers extrator tests', () => {
  before(async () => {
    // Get application
    app = await express.init(mongoose.connection.db);
    agent = request.agent(app);
  });

  describe('Get the list of controllers', () => {
    it('I am not allowed to call the API if I do not have the IAM "controllers:list"', async () => {
      await createUser(credentials, ['users:auth:signin']);
      await agent
        .post('/api/v1/auth/signin')
        .send(credentials)
        .expect(200);
      await agent.get(`${prefix}/devtools/controllers`).expect(403);
    });

    it('I am allowed to call the API if I have the IAM "controllers:list"', async () => {
      await createUser(credentials, ['users:auth:signin', 'modules:devtools:controllers:list']);
      await agent
        .post('/api/v1/auth/signin')
        .send(credentials)
        .expect(200);
      await agent.get(`${prefix}/devtools/controllers`)
        .query({
          ns: `modules:${moduleName}`,
        })
        .expect(200);
    });

    it('Depth not specified, The server should return at least the tree of the devtools folder not scanned', async () => {
      await createUser(credentials, ['users:auth:signin', 'modules:devtools:controllers:list']);
      await agent
        .post('/api/v1/auth/signin')
        .send(credentials)
        .expect(200);
      const { body } = await agent.get(`${prefix}/devtools/controllers`)
        .query({
          ns: `modules:${moduleName}`,
        })
        .expect(200);
      const ctrl = body.find(c => c.name === 'assets');
      expect([ctrl.type, ctrl.loaded, ctrl.children.length]).to.eql(['folder', false, 0]);
    });
  });

  describe('I can specify the depth. The server should return the right controllers list/at least the tree of the devtools folder', () => {
    it('I am allowed to list the folders tree (at least the devtools) if i am not aware of the depth tree (-1)', async () => {
      await createUser(credentials, ['users:auth:signin', 'modules:devtools:controllers:list']);
      await agent
        .post('/api/v1/auth/signin')
        .send(credentials)
        .expect(200);
      const { body } = await agent.get(`${prefix}/devtools/controllers`)
        .query({
          ns: `modules:${moduleName}`,
          $depth: -1,
        })
        .expect(200);
      expect(body).to.be.an('array');
      const ctrl = body.find(c => c.name === 'assets');
      expect([ctrl.type, ctrl.loaded]).to.eql(['folder', true]);
      expect(ctrl.children.length).to.not.eql(0);
      ctrl.children.forEach((element) => {
        expect(element.loaded).to.eql(true);
      });
    });

    it('I am allowed to list at least the devtools folder without scaning children ', async () => {
      await createUser(credentials, ['users:auth:signin', 'modules:devtools:controllers:list']);
      await agent
        .post('/api/v1/auth/signin')
        .send(credentials)
        .expect(200);
      const { body } = await agent.get(`${prefix}/devtools/controllers`)
        .query({
          ns: `modules:${moduleName}`,
          $depth: 0,
        })
        .expect(200);
      expect(body).to.be.an('array');
      const ctrl = body.find(c => c.name === 'assets');
      expect([ctrl.type, ctrl.loaded, ctrl.children.length]).to.eql(['folder', false, 0]);
    });

    it('I am allowed to list at least the tree of the assets folder without scaning children', async () => {
      await createUser(credentials, ['users:auth:signin', 'modules:devtools:controllers:list']);
      await agent
        .post('/api/v1/auth/signin')
        .send(credentials)
        .expect(200);
      const { body } = await agent.get(`${prefix}/devtools/controllers?$depth=1`)
        .query({
          ns: `modules:${moduleName}`,
          $depth: 1,
        })
        .expect(200);
      expect(body).to.be.an('array');
      const ctrl = body.find(c => c.name === 'assets');
      const assets = ctrl.children.find(c => c.name === 'testFolder');
      expect([assets.type, assets.loaded, assets.children.length]).to.eql(['folder', false, 0]);
    });

    it('I can make sure that the file scanned does not contain any controller', async () => {
      await createUser(credentials, ['users:auth:signin', 'modules:devtools:controllers:list']);
      await agent
        .post('/api/v1/auth/signin')
        .send(credentials)
        .expect(200);
      const { body } = await agent.get(`${prefix}/devtools/controllers`)
        .query({
          ns: `modules:${moduleName}`,
          $depth: 2,
        })
        .expect(200);
      expect(body).to.be.an('array');
      const ctrl = body.find(c => c.name === 'assets');
      const assets = ctrl.children.find(c => c.name === 'testFolder');
      const isEmpty = assets.children.find(c => c.name === 'file.js');
      expect([isEmpty.name, isEmpty.type, isEmpty.loaded, isEmpty.children.length]).to.eql([
        'file.js',
        'file',
        true,
        0,
      ]);
    });

    it('I can make sure that the file scanned contain one controller', async () => {
      await createUser(credentials, ['users:auth:signin', 'modules:devtools:controllers:list']);
      await agent
        .post('/api/v1/auth/signin')
        .send(credentials)
        .expect(200);
      const { body } = await agent.get(`${prefix}/devtools/controllers`)
        .query({
          ns: `modules:${moduleName}`,
          $depth: 2,
        })
        .expect(200);
      expect(body).to.be.an('array');
      const assets = body.find(c => c.name === 'assets');
      const oneController = assets.children.find(c => c.name === 'oneController.js');
      const childrenController = oneController.children.find(c => c.title === 'ok1');
      expect('controller').to.equal(childrenController.type);
      expect(childrenController.params.length).to.equal(3);
      const prms1 = childrenController.params.find(c => c.name === 'req');
      const prms2 = childrenController.params.find(c => c.name === 'res');
      const prms3 = childrenController.params.find(c => c.name === 'next');
      childrenController.params.forEach((e) => {
        expect(Object.keys(e)).to.eql(['name', 'description', 'type']); // passes
      });
      expect([prms1.name, prms1.description, prms1.type]).to.eql([
        'req',
        'The request',
        'IncommingMessage',
      ]);
      expect([prms2.name, prms2.description, prms2.type]).to.eql([
        'res',
        'The response',
        'OutcommingMessage',
      ]);
      expect([prms3.name, prms3.description, prms3.type]).to.eql([
        'next',
        'Go to the next middleware',
        'Function',
      ]);
    });
  });

  describe('I can specify the folderName. The server should return the controllers found in the appropriate path of the introduced folder', () => {
    it('I am not allowed to list controllers if I dont have the right path of folderName wanted', async () => {
      await createUser(credentials, ['users:auth:signin', 'modules:devtools:controllers:list']);
      await agent
        .post('/api/v1/auth/signin')
        .send(credentials)
        .expect(200);
      await agent.get(`${prefix}/devtools/controllers`)
        .query({
          ns: `modules:${moduleName}`,
          $folder: 'asset',
        })
        .expect(404);
    });
    it('I am not allowed to list controllers if I have the right path of fileName wanted', async () => {
      await createUser(credentials, ['users:auth:signin', 'modules:devtools:controllers:list']);
      await agent
        .post('/api/v1/auth/signin')
        .send(credentials)
        .expect(200);
      const { body } = await agent
        .get(`${prefix}/devtools/controllers`)
        .query({
          ns: `modules:${moduleName}`,
          $folder: 'assets/oneController.js',
        })
        .expect(200);
      expect(body).to.be.an('array');
      const oneControllerContent = body.find(c => c.name === 'Check results');
      const param = oneControllerContent.params;
      expect([
        oneControllerContent.title,
        oneControllerContent.type,
        oneControllerContent.description,
        oneControllerContent.params.length,
      ]).to.eql(['ok1', 'controller', 'Simple request check, just send a "true" word', 3]);
      expect([param[0].name, param[0].description, param[0].type]).to.eql([
        'req',
        'The request',
        'IncommingMessage',
      ]);
      expect([param[1].name, param[1].description, param[1].type]).to.eql([
        'res',
        'The response',
        'OutcommingMessage',
      ]);
      expect([param[2].name, param[2].description, param[2].type]).to.eql([
        'next',
        'Go to the next middleware',
        'Function',
      ]);
    });
    it('I am allowed to list controllers if I have the right path of folderName wanted without specifying the depth', async () => {
      await createUser(credentials, ['users:auth:signin', 'modules:devtools:controllers:list']);
      await agent
        .post('/api/v1/auth/signin')
        .send(credentials)
        .expect(200);
      const { body } = await agent
        .get(`${prefix}/devtools/controllers`)
        .query({
          ns: `modules:${moduleName}`,
          $folder: 'assets',
        })
        .expect(200);
      expect(body).to.be.an('array');
      const isEmpty = body.find(c => c.name === 'isEmpty.js');
      const oneController = body.find(c => c.name === 'oneController.js');
      const folder = body.find(c => c.name === 'testFolder');
      // expect(rootFolder).to.not.be.undefined;
      expect([isEmpty.name, isEmpty.type, isEmpty.loaded, isEmpty.children.length]).to.eql([
        'isEmpty.js',
        'file',
        true,
        0,
      ]);
      expect([
        oneController.name,
        oneController.type,
        oneController.loaded,
        oneController.children.length,
      ]).to.eql(['oneController.js', 'file', true, 1]);
      expect([folder.name, folder.type, folder.loaded, folder.children.length]).to.eql([
        'testFolder',
        'folder',
        false,
        0,
      ]);
    });

    it('I am allowed to list controllers if I have the right path of folderName wanted on specifying the depth', async () => {
      await createUser(credentials, ['users:auth:signin', 'modules:devtools:controllers:list']);
      await agent
        .post('/api/v1/auth/signin')
        .send(credentials)
        .expect(200);
      const { body } = await agent
        .get(`${prefix}/devtools/controllers`)
        .query({
          ns: `modules:${moduleName}`,
          $folder: 'assets',
          $depth: 1,
        })
        .expect(200);
      expect(body).to.be.an('array');
      const isEmpty = body.find(c => c.name === 'isEmpty.js');
      const oneController = body.find(c => c.name === 'oneController.js');
      const folder = body.find(c => c.name === 'testFolder');
      expect([isEmpty.name, isEmpty.type, isEmpty.loaded, isEmpty.children.length]).to.eql([
        'isEmpty.js',
        'file',
        true,
        0,
      ]);
      expect([
        oneController.name,
        oneController.type,
        oneController.loaded,
        oneController.children.length,
      ]).to.eql(['oneController.js', 'file', true, 1]);
      expect([folder.name, folder.type, folder.loaded, folder.children.length]).to.eql([
        'testFolder',
        'folder',
        true,
        1,
      ]);
    });
  });

  afterEach(async () => {
    await Promise.all([User.remove()]);
  });
});

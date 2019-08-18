/* eslint-env node, mocha */
/* eslint-disable import/no-dynamic-require, no-unused-expressions */
const request = require('supertest');
const { resolve, basename } = require('path');
const Ajv = require('ajv');
const { expect } = require('chai');
const { model, connection } = require('mongoose');
const {
  it, before, describe, afterEach,
} = require('mocha');

const User = model('User');

const { createUser } = require(resolve('helpers/utils'));

const ajv = new Ajv();
// official schemas
const schema = require('../schemas/collection.server.schema.json');

const schemaValidator = ajv.compile(schema);

const express = require(resolve('./config/lib/express'));
const { prefix } = require(resolve('config'));

let app;
let agent;
const credentials = {
  username: 'username',
  password: 'jsI$Aw3$0m3',
};
const currentParentFolder = basename(resolve(__dirname, '..'));

// find subfolder from folder given in the JSON collection
const findSubFolder = (folder, file, array) => {
  let findFolder;
  let findFile;
  array.forEach((x) => {
    x.item.forEach((parentFolder) => {
      if (parentFolder.name === folder) {
        findFolder = parentFolder;
        // search for iam file in the folder found
        findFolder.item.forEach((subFolder) => {
          if (subFolder.name === file) {
            findFile = subFolder;
          }
        });
      }
    });
  });
  return findFile;
};
// search for following words
function multiSearch(text, searchWords) {
  const searchExp = new RegExp(`(${searchWords.join(')|(')})`, 'gi');
  return text.match(searchExp).length === searchWords.length;
}

/**
 * Sections tests
 */
describe('collection generator tests', () => {
  before(async () => {
    // Get application
    app = await express.init(connection.db);
    agent = request.agent(app);
  });

  describe('Generated postman documentation', () => {
    it('I am not allowed to get the postman documentation if i do not have the IAM "postman:doc"', async () => {
      await createUser(credentials, []);
      await agent
        .post(`${prefix}/auth/signin`)
        .send(credentials)
        .expect(200);
      await agent.get(`${prefix}/devtools/postman/doc`).expect(403);
    });
    it('I can have access to the postman documentation if i have the right IAM as well as authenticated', async () => {
      await createUser(credentials, ['modules:devtools:postman:doc:collections']);
      await agent
        .post(`${prefix}/auth/signin`)
        .send(credentials)
        .expect(200);
      await agent.get(`${prefix}/devtools/postman/doc`).expect(200);
    });
    it('Collection generated should be validated if it respects the official JSON schema\'s format ', async () => {
      await createUser(credentials, ['modules:devtools:postman:doc:collections']);
      await agent
        .post(`${prefix}/auth/signin`)
        .send(credentials)
        .expect(200);
      const collection = await agent.get(`${prefix}/devtools/postman/doc`).expect(200);
      expect(schemaValidator(collection.body)).to.be.true;
    });
  });
  describe('Test module\'s collection IAM\'s content ', () => {
    it('IAM should be found in the collection generated', async () => {
      await createUser(credentials, ['modules:devtools:postman:doc:collections']);
      await agent
        .post(`${prefix}/auth/signin`)
        .send(credentials)
        .expect(200);
      const collection = await agent.get(`${prefix}/devtools/postman/doc`).expect(200);
      expect(schemaValidator(collection.body)).to.be.true;
      const iam = findSubFolder(currentParentFolder, 'postman', collection.body.item);
      expect(iam).to.be.an('object');
    });
    it('IAM\'s item should be an array', async () => {
      await createUser(credentials, ['modules:devtools:postman:doc:collections']);
      await agent
        .post(`${prefix}/auth/signin`)
        .send(credentials)
        .expect(200);
      const collection = await agent.get(`${prefix}/devtools/postman/doc`).expect(200);
      expect(schemaValidator(collection.body)).to.be.true;
      const iam = findSubFolder(currentParentFolder, 'postman', collection.body.item);
      expect(iam.item).to.be.an('array');
    });
    it('IAM\'s item should contain objects', async () => {
      await createUser(credentials, ['modules:devtools:postman:doc:collections']);
      await agent
        .post(`${prefix}/auth/signin`)
        .send(credentials)
        .expect(200);
      const collection = await agent.get(`${prefix}/devtools/postman/doc`).expect(200);
      expect(schemaValidator(collection.body)).to.be.true;
      const iam = findSubFolder(currentParentFolder, 'postman', collection.body.item);
      iam.item.map((x) => expect(x).to.be.an('object'));
    });
    it('Each IAM\'s item object should contain a name', async () => {
      await createUser(credentials, ['modules:devtools:postman:doc:collections']);
      await agent
        .post(`${prefix}/auth/signin`)
        .send(credentials)
        .expect(200);
      const collection = await agent.get(`${prefix}/devtools/postman/doc`).expect(200);
      expect(schemaValidator(collection.body)).to.be.true;
      const iam = findSubFolder(currentParentFolder, 'postman', collection.body.item);
      expect(iam.item.map((x) => x.name).length).to.be.equal(iam.item.length);
    });
    it('Each IAM\'s item object should contain an object request', async () => {
      await createUser(credentials, ['modules:devtools:postman:doc:collections']);
      await agent
        .post(`${prefix}/auth/signin`)
        .send(credentials)
        .expect(200);
      const collection = await agent.get(`${prefix}/devtools/postman/doc`).expect(200);
      expect(schemaValidator(collection.body)).to.be.true;
      const iam = findSubFolder(currentParentFolder, 'postman', collection.body.item);
      iam.item.map((x) => expect(x.request).to.be.an('object'));
    });
    it('Each IAM\'s item object should contain a method (Either a get, post, put, delete)', async () => {
      await createUser(credentials, ['modules:devtools:postman:doc:collections']);
      await agent
        .post(`${prefix}/auth/signin`)
        .send(credentials)
        .expect(200);
      const collection = await agent.get(`${prefix}/devtools/postman/doc`).expect(200);
      expect(schemaValidator(collection.body)).to.be.true;
      const iam = findSubFolder(currentParentFolder, 'postman', collection.body.item);
      iam.item.map((x) => expect(x.request.method).to.satisfy((m) => {
        if (m === 'GET' || m === 'PUT' || m === 'DELETE' || m === 'POST') {
          return true;
        }
        return false;
      }));
    });
    it('Each IAM\'s item object should contain an object url', async () => {
      await createUser(credentials, ['modules:devtools:postman:doc:collections']);
      await agent
        .post(`${prefix}/auth/signin`)
        .send(credentials)
        .expect(200);
      const collection = await agent.get(`${prefix}/devtools/postman/doc`).expect(200);
      expect(schemaValidator(collection.body)).to.be.true;
      const iam = findSubFolder(currentParentFolder, 'postman', collection.body.item);
      iam.item.map((x) => expect(x.request.url).to.be.an('object'));
    });
    it('host\'s elements in url should only contain host and prefix elements', async () => {
      await createUser(credentials, [
        'modules:devtools:postman:doc:collections',
        'users:auth:signin',
      ]);
      await agent
        .post(`${prefix}/auth/signin`)
        .send(credentials)
        .expect(200);
      const collection = await agent.get(`${prefix}/devtools/postman/doc`).expect(200);
      expect(schemaValidator(collection.body)).to.be.true;
      const iam = findSubFolder(currentParentFolder, 'postman', collection.body.item);
      iam.item.map(
        (x) => expect(multiSearch(x.request.url.host[0], ['host', 'prefix'])).to.be.true,
      );
    });
    it('Path\'s elements in url shouldn\'t contain a "/"', async () => {
      await createUser(credentials, [
        'modules:devtools:postman:doc:collections',
        'users:auth:signin',
      ]);
      await agent
        .post(`${prefix}/auth/signin`)
        .send(credentials)
        .expect(200);
      const collection = await agent.get(`${prefix}/devtools/postman/doc`).expect(200);
      expect(schemaValidator(collection.body)).to.be.true;
      const iam = findSubFolder(currentParentFolder, 'postman', collection.body.item);
      iam.item.map((x) => x.request.url.path.forEach((p) => expect(p).to.satisfy((pth) => {
        if (pth.includes('/')) {
          return false;
        }
        return true;
      })));
    });
    it('Request\'s description should contain at least a middleware', async () => {
      await createUser(credentials, [
        'modules:devtools:postman:doc:collections',
        'users:auth:signin',
      ]);
      await agent
        .post(`${prefix}/auth/signin`)
        .send(credentials)
        .expect(200);
      const collection = await agent.get(`${prefix}/devtools/postman/doc`).expect(200);
      expect(schemaValidator(collection.body)).to.be.true;
      const iam = findSubFolder(currentParentFolder, 'postman', collection.body.item);
      iam.item.forEach((x) => {
        const middleware = x.request.description.split('Middlewares:')[1];
        // elements of each line
        const res = middleware.split('\n\n');
        const array = [];
        res.forEach((row) => {
          // get ride of empty spaces
          const elements = row.trim().split(' ');
          // get only first element
          const firstElement = elements[0].trim();
          // get first character, parse to int, validate it is infact integer
          const element = firstElement.charAt(0);
          array.push(element);
        });
        expect(array.length).to.be.at.least(1);
      });
    });
  });
  afterEach(async () => {
    await Promise.all([User.remove()]);
  });
});

// eslint-disable-next-line import/no-unresolved
const { validate } = require('utils');
const ctrl = require('../controllers/config.server.controller');

const setSchema = require('../schemas/set-env.server.schema.json');

/**
* @type { IAM.default }
*/
module.exports = {
  prefix: '/devtools/config',
  routes: [{
    path: '/',
    methods: {
      get: {
        iam: 'modules:devtools:config:list',
        title: 'List all configs',
        groups: [],
        parents: ['modules:devtools', 'modules:devtools:config'],
        description: 'List all configurable fields from all functional modules',
        middlewares: [
          ctrl.list,
        ],
      },
    },
  }, {
    path: '/preview',
    methods: {
      get: {
        iam: 'modules:devtools:config:preview',
        title: 'Preview env file',
        groups: [],
        parents: ['modules:devtools', 'modules:devtools:config'],
        description: 'Preview the content of the env file',
        middlewares: [
          ctrl.preview,
        ],
      },
    },
  }, {
    path: '/set',
    methods: {
      /**
       * @body
       * [{
       *   "key": "APP_TITLE",
       *   "value": "{{appTitle}}"
       * }, {
       *   "key": "PORT",
       *   "remove": true
       * }]
       */
      put: {
        iam: 'modules:devtools:config:set',
        title: 'Set env variables',
        groups: [],
        parents: ['modules:devtools', 'modules:devtools:config'],
        description: 'Edit env variables of the current environment',
        middlewares: [
          validate(setSchema),
          ctrl.set,
        ],
      },
    },
  }],
};

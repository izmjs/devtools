const { validate } = require('@helpers/utils');

const ctrls = require('../controllers/manage.server.controller');
const addModuleSchema = require('../schemas/add-module.server.schema');

/**
* @type { IAM.default }
*/
module.exports = {
  prefix: '/devtools/manage',
  routes: [{
    path: '/reload',
    methods: {
      post: {
        iam: 'modules:devtools:manage:reload',
        title: 'Restart',
        groups: [],
        parents: ['modules:devtools', 'modules:devtools:manage'],
        description: 'Restart the current process',
        middlewares: [
          ctrls.processTree,
          ctrls.restart,
        ],
      },
    },
  }, {
    path: '/ptree',
    methods: {
      get: {
        iam: 'modules:devtools:manage:ptree',
        title: 'Process tree',
        groups: [],
        parents: ['modules:devtools', 'modules:devtools:manage'],
        description: 'Get the process tree',
        middlewares: [
          ctrls.processTree,
          ctrls.processTreeResult,
        ],
      },
    },
  }, {
    path: '/check',
    methods: {
      get: {
        iam: 'modules:devtools:manage:check',
        title: 'Check server is up',
        groups: [],
        parents: ['modules:devtools', 'modules:devtools:manage'],
        description: 'Check the server is up and running',
        middlewares: [
          ctrls.check,
        ],
      },
    },
  }, {
    path: '/add-module',
    methods: {
      /**
       * @body
       * {
       *   "name": "todo",
       *   "git": true,
       *   "install": true
       * }
       */
      post: {
        iam: 'modules:devtools:manage:add-module',
        title: 'Add new module',
        groups: [],
        parents: ['modules:devtools', 'modules:devtools:manage'],
        description: 'Add a new module to the boilerplate',
        middlewares: [
          validate(addModuleSchema),
          ctrls.addModule,
        ],
      },
    },
  }],
};

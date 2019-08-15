const ctrls = require('../controllers/npm.server.controller');
const nsCtrls = require('../controllers/ns.server.controller');

/**
 * @type { IAM.default }
 */
module.exports = {
  prefix: '/devtools/npm',
  routes: [{
    path: '/search',
    methods: {
      /**
       * @params
         * [{
         *   "key": "$top",
         *   "value": "10",
         *   "description": "Number of modules to retrieve"
         * }, {
         *   "key": "$skip",
         *   "value": "0",
         *   "description": "Number of modules to skip. Used for pagination."
         * }, {
         *   "key": "text",
         *   "value": "express",
         *   "description": "Search criteria"
         * }]
       */
      get: {
        iam: 'modules:devtools:npm:search',
        title: 'Search a module',
        groups: [],
        parents: ['modules:devtools', 'modules:devtools:npm'],
        description: 'Look for a module',
        middlewares: [
          ctrls.search,
        ],
      },
    },
  }, {
    path: '/meta',
    methods: {
      /**
       * @params
       * [{
       *   "key": "ns",
       *   "value": "modules:devtools",
       *   "description": "The namespace (usually it is has the form `type`:`module`. `type`: The type of the module (`vendor` or `modules`), and `module`: The name of the module)"
       * }]
      */
      get: {
        iam: 'modules:devtools:npm:meta',
        title: 'Current module metadata',
        groups: [],
        parents: ['modules:devtools', 'modules:devtools:npm'],
        description: 'Get current module metadata',
        middlewares: [
          nsCtrls.check,
          ctrls.loadPackageJson,
          ctrls.meta,
        ],
      },
      /**
       * @params
       * [{
       *   "key": "ns",
       *   "value": "modules:devtools",
       *   "description": "The namespace (usually it is has the form `type`:`module`. `type`: The type of the module (`vendor` or `modules`), and `module`: The name of the module)"
       * }]
       *
       * @body
       * {
       *   "version": "0.2.1"
       * }
       */
      post: {
        iam: 'modules:devtools:npm:meta:set',
        title: 'Set current module metadata',
        groups: [],
        parents: ['modules:devtools', 'modules:devtools:npm'],
        description: 'Set current module metadata',
        middlewares: [
          nsCtrls.check,
          ctrls.loadPackageJson,
          ctrls.setMeta,
          ctrls.savePackageJson,
        ],
      },
    },
  }, {
    path: '/installed',
    methods: {
      /**
       * @params
       * [{
       *   "key": "ns",
       *   "value": "modules:devtools",
       *   "description": "The namespace (usually it is has the form `type`:`module`. `type`: The type of the module (`vendor` or `modules`), and `module`: The name of the module)"
       * }, {
       *   "key": "mode",
       *   "value": "prod",
       *   "description": "The module type"
       * }]
       */
      get: {
        iam: 'modules:devtools:npm:installed',
        title: 'Get installed packages',
        groups: [],
        parents: ['modules:devtools', 'modules:devtools:npm'],
        description: 'Get installed NPM packages of a specific type',
        middlewares: [
          nsCtrls.check,
          ctrls.loadPackageJson,
          ctrls.installed,
        ],
      },
    },
  }, {
    path: '/install',
    methods: {
      /**
       * @params
       * [{
       *   "key": "ns",
       *   "value": "modules:devtools",
       *   "description": "The namespace (usually it is has the form `type`:`module`. `type`: The type of the module (`vendor` or `modules`), and `module`: The name of the module)"
       * }]
       *
       * @body
       * {
       *   "name": "express",
       *   "mode": "prod",
       *   "version": "latest"
       * }
       */
      post: {
        iam: 'modules:devtools:npm:install',
        title: 'Install a module',
        groups: [],
        parents: ['modules:devtools', 'modules:devtools:npm'],
        description: 'Install a module and add it to the dependencies',
        middlewares: [
          nsCtrls.check,
          ctrls.install,
        ],
      },
    },
  }, {
    path: '/upload',
    methods: {
      /**
       * @body
       * {
       *   "registry": "https://registry.npmjs.org",
       *   "username": "{{npmUsername}}",
       *   "password": "{{npmPassword}}",
       *   "name": "devtools-fm",
       *   "version": "1.2.0",
       *   "save": true
       * }
       *
       * @params
       * [{
       *   "key": "ns",
       *   "value": "modules:devtools",
       *   "description": "The namespace (usually it is has the form `type`:`module`. `type`: The type of the module (`vendor` or `modules`), and `module`: The name of the module)"
       * }]
       */
      post: {
        iam: 'modules:devtools:npm:upload',
        title: 'Upload a FM',
        groups: [],
        parents: ['modules:devtools', 'modules:devtools:npm'],
        description: 'Upload a functional module to NPM registry',
        middlewares: [
          nsCtrls.check,
          ctrls.load,
          ctrls.tarball,
          ctrls.publish,
        ],
      },
    },
  }, {
    path: '/download',
    methods: {
      /**
       * @body
       * {
       *   "registry": "https://registry.npmjs.org",
       *   "username": "{{npmUsername}}",
       *   "password": "{{npmPassword}}",
       *   "name": "devtools-fm",
       *   "version": "latest"
       * }
       */
      post: {
        iam: 'modules:devtools:npm:download',
        title: 'Download a functional module',
        groups: [],
        parents: ['modules:devtools', 'modules:devtools:npm'],
        description: 'Download a functional module from the NPM registry',
        middlewares: [
          ctrls.load,
          ctrls.downloadFM,
        ],
      },
    },
  }, {
    path: '/remove',
    methods: {
      /**
       * @params
       * [{
       *   "key": "ns",
       *   "value": "modules:devtools",
       *   "description": "The namespace (usually it is has the form `type`:`module`. `type`: The type of the module (`vendor` or `modules`), and `module`: The name of the module)"
       * }]
       */
      delete: {
        iam: 'modules:devtools:npm:remove',
        title: 'Remove a dependency',
        groups: [],
        parents: ['modules:devtools', 'modules:devtools:npm'],
        description: 'Remove an NPM dependency',
        middlewares: [
          nsCtrls.check,
          ctrls.removeModule,
        ],
      },
    },
  }, {
    path: '/remove-fm',
    methods: {
      delete: {
        iam: 'modules:devtools:npm:remove:fm',
        title: 'Remove a functional module',
        groups: [],
        parents: ['modules:devtools', 'modules:devtools:npm'],
        description: 'Remove a functional module from the current project',
        middlewares: [
          ctrls.removeFM,
        ],
      },
    },
  }, {
    path: '/audit',
    methods: {
      /**
       * @params
       * [{
       *   "key": "ns",
       *   "value": "modules:devtools",
       *   "description": "The namespace (usually it is has the form `type`:`module`. `type`: The type of the module (`vendor` or `modules`), and `module`: The name of the module)"
       * }]
       */
      post: {
        iam: 'modules:devtools:npm:audit',
        title: 'Audit dependencies',
        groups: [],
        parents: ['modules:devtools:npm', 'modules:devtools'],
        description: 'Check dependencies security',
        middlewares: [
          ctrls.audit,
        ],
      },
    },
  }, {
    path: '/outdated',
    methods: {
      /**
       * @params
       * [{
       *   "key": "ns",
       *   "value": "modules:devtools",
       *   "description": "The namespace (usually it is has the form `type`:`module`. `type`: The type of the module (`vendor` or `modules`), and `module`: The name of the module)"
       * }]
       */
      post: {
        iam: 'modules:devtools:npm:outdated',
        title: 'Check updates',
        groups: [],
        parents: ['modules:devtools:npm', 'modules:devtools'],
        description: 'Check outdated dependencies',
        middlewares: [
          ctrls.checkUpdates,
        ],
      },
    },
  }],
};

const ctrls = require('../controllers/files.server.controller');

/**
 * @type { IAM.default }
 */
module.exports = {
  prefix: '/devtools/files',
  routes: [
    {
      path: '/open',
      methods: {
        /**
         * @params
         * [{
         *   "key": "file",
         *   "value": "app.config.js",
         *   "description": "The file to open"
         * }, {
         *   "key": "line",
         *   "value": "4",
         *   "description": "The line"
         * }, {
         *   "key": "col",
         *   "value": "3",
         *   "description": "The column"
         * }, {
         *   "key": "ns",
         *   "value": "modules:devtools",
         *   "description": "[Optional] The namspace. If not specified, the server will look for the file from the root folder of the project"
         * }]
         */
        get: {
          iam: 'modules:devtools:files:open',
          title: 'Open the default editor',
          groups: [],
          parents: ['modules:devtools', 'modules:devtools:files'],
          description: 'Open a file in the system default editor',
          middlewares: [
            ctrls.checkNS,
            ctrls.exists,
            ctrls.open,
          ],
        },
      },
    },
    {
      path: '/edit',
      methods: {
        /**
         * @params
         * [{
         *   "key": "isAdd",
         *   "value": "false",
         *   "description": "Add current project in an already opened vscode instance"
         * }]
         */
        post: {
          iam: 'modules:devtools:files:edit',
          title: 'Edit project',
          groups: [],
          parents: ['modules:devtools', 'modules:devtools:files'],
          description: 'Edit project in vscode',
          middlewares: [
            ctrls.edit,
          ],
        },
      },
    },
  ],
};

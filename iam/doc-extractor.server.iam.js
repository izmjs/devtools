const ctrls = require('../controllers/doc-extractor.server.controller');
const nsCtrls = require('../controllers/ns.server.controller');

/**
 * @type { IAM.default }
 */
module.exports = {
  prefix: '/devtools/controllers',
  routes: [
    {
      path: '/',
      methods: {
        /**
         * @params
         * [{
         *   "key": "$folder",
         *   "value": "",
         *   "description": "The base folder where we want to extract controllers"
         * }, {
         *   "key": "$depth",
         *   "value": "0",
         *   "description": "The depth to look for. Specify `-1` to extract all children on any depth."
         * }, {
         *   "key": "ns",
         *   "value": "modules:devtools",
         *   "description": "The namespace (usually it is has the form `type`:`module`. `type`: The type of the module (`vendor` or `modules`), and `module`: The name of the module)"
         * }]
         */
        get: {
          parents: ['modules:devtools', 'modules:devtools:controllers'],
          iam: 'modules:devtools:controllers:list',
          title: 'Extract controllers',
          description: 'API to extract list of controllers of all functional modules',
          middlewares: [
            nsCtrls.check,
            ctrls.sanitize,
            ctrls.list,
          ],
        },
      },
    },
  ],
};

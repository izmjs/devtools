const docCtrls = require('../controllers/postman-doc.server.controller');
const ctrls = require('../controllers/postman.server.controller');

/** */
module.exports = {
  prefix: '/devtools/postman',
  routes: [
    {
      path: '/doc',
      methods: {
        /**
         * @params
         * [{
         *  "key": "force",
         *  "value": "true",
         *  "description": "Use this parameter to regenerate documentation from the code and ignore the cache"
         * }]
         */
        get: {
          parents: ['modules:postman', 'modules:devtools'],
          iam: 'modules:devtools:postman:doc:collections',
          title: 'Export postman documentation',
          description: 'Will generate postman documentation of the current application',
          middlewares: [
            docCtrls.cache,
            docCtrls.init,
            docCtrls.info,
            docCtrls.variable,
            docCtrls.items,
            docCtrls.result,
          ],
        },
      },
    },
    {
      path: '/collections',
      methods: {
        /**
         * @test
         * pm.test("Status code is 200", () => {
         *   pm.response.to.have.status(200);
         *   const json = pm.response.json();
         *   if(!Array.isArray(json) || json.length === 0) {
         *     return;
         *   }
         *
         *   let colId = pm.variables.get("collectionId");
         *
         *   if(!colId || !json.find(one => one.id === colId)) {
         *     pm.environment.set("collectionId", json[0].id);
         *   }
         * });
         *
         * @example
         * {
         *   "name": "Not authorized",
         *   "response": {
         *     "status": 403,
         *     "body": {
         *       "message": "You are not authorized to access this API"
         *     }
         *   }
         * }
         */
        get: {
          parents: ['modules:postman', 'modules:devtools'],
          iam: 'modules:devtools:postman:collections:list',
          title: 'List accessible collections',
          description: 'Returns the list of all postman collections that are accessible by you.',
          middlewares: [ctrls.checkKey, ctrls.list],
        },
        // post: {
        //   iam: 'postman:collections:create',
        //   title: 'Create new postman collection',
        //   description: 'Will create a new postman collection',
        //   middlewares: [
        //     ctrls.create,
        //   ],
        // },
      },
    },
    {
      path: '/collections/:collectionId',
      methods: {
        put: {
          parents: ['modules:postman', 'modules:devtools'],
          iam: 'modules:devtools:postman:collections:sync',
          title: 'Synchronize postman collection',
          description: 'Will put latest postman documentation to a specific collection',
          middlewares: [
            ctrls.checkKey,
            ctrls.isCached,
            ctrls.sync,
          ],
        },
      },
    },
    {
      path: '/environment',
      methods: {
        /**
         * @params
         * [{
         *   "key": "download",
         *   "value": "false",
         *   "description": "Download the env vars instead of return them"
         * }]
         */
        get: {
          parents: ['modules:postman', 'modules:devtools'],
          iam: 'modules:devtools:postman:doc:environment',
          title: 'Get environment template',
          description: '',
          middlewares: [
            ctrls.isCached,
            ctrls.variables,
          ],
        },
      },
    },
  ],
};

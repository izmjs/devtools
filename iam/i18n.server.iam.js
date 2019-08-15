// eslint-disable-next-line import/no-unresolved
const { validate } = require('utils');
const ctrls = require('../controllers/i18n.server.controller');
const nsCtrls = require('../controllers/ns.server.controller');

const translateSchema = require('../schemas/translate.server.schema');
const removeLngsSchema = require('../schemas/remove-lngs.server.schema');

/**
 * @type { IAM.default }
 */
module.exports = {
  prefix: '/devtools/i18n',
  routes: [
    {
      path: '/',
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
          iam: 'modules:devtools:i18n:list',
          title: 'Get i18n of specific module',
          groups: [],
          parents: ['modules:devtools', 'modules:devtools:i18n'],
          description: 'Get i18n of a specific module',
          middlewares: [
            nsCtrls.check,
            ctrls.list,
          ],
        },
        /**
         * @body
         * {
         *   "key": "TEST_KEY",
         *   "en": "Just a test",
         *   "fr": "Juste un test",
         *   "ar": "فقط للتجربة"
         * }
         *
         * @example
         * {
         *   "name": "Add/Edit in bulk mode",
         *   "response": {
         *     "status": 204
         *   },
         *   "request": {
         *     "body": [{
         *       "key": "TEST_KEY_1",
         *       "en": "Just a test",
         *       "fr": "Juste un test",
         *       "ar": "فقط للتجربة"
         *     }, {
         *       "key": "TEST_KEY_2",
         *       "en": "Just a test",
         *       "fr": "Juste un test",
         *       "ar": "فقط للتجربة"
         *     }]
         *   }
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
          iam: 'modules:devtools:i18n:edit',
          title: 'Add/Edit keys',
          groups: [],
          parents: ['modules:devtools', 'modules:devtools:i18n'],
          description: 'Add or edit keys in specific module',
          middlewares: [
            nsCtrls.check,
            ctrls.edit,
          ],
        },
      },
    },
    {
      path: '/ns',
      methods: {
        get: {
          iam: 'modules:devtools:i18n:namespaces',
          title: 'Get namespaces',
          groups: [],
          parents: ['modules:devtools', 'modules:devtools:i18n'],
          description: 'Get list of available namespaces',
          middlewares: [
            ctrls.ns,
          ],
        },
      },
    },
    {
      path: '/delete',
      methods: {
        /**
         * @body
         * ["TEST_KEY"]
         *
         * @params
         * [{
         *   "key": "ns",
         *   "value": "modules:devtools",
         *   "description": "The namespace (usually it is has the form `type`:`module`. `type`: The type of the module (`vendor` or `modules`), and `module`: The name of the module)"
         * }]
         */
        post: {
          iam: 'modules:devtools:i18n:delete',
          title: 'Remove i18n key(s)',
          groups: [],
          parents: ['modules:devtools', 'modules:devtools:i18n'],
          description: 'Remove i18n key(s) from a namespace',
          middlewares: [
            nsCtrls.check,
            ctrls.remove,
          ],
        },
      },
    },
    {
      path: '/translate',
      methods: {
        /**
         * @body
         * {
         *   "code": "ar"
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
          iam: 'modules:devtools:i18n:translate',
          title: 'Translate to a specific language',
          groups: [],
          parents: ['modules:devtools', 'modules:devtools:i18n'],
          description: 'Automatically translate to a specific language',
          middlewares: [
            validate(translateSchema),
            nsCtrls.check,
            ctrls.checkTranslateEngine,
            ctrls.translate,
          ],
        },
      },
    },
    {
      path: '/lngs/delete',
      methods: {
        /**
         * @body
         * ["ar"]
         *
         * @params
         * [{
         *   "key": "ns",
         *   "value": "modules:devtools",
         *   "description": "The namespace (usually it is has the form `type`:`module`. `type`: The type of the module (`vendor` or `modules`), and `module`: The name of the module)"
         * }]
         */
        post: {
          iam: 'modules:devtools:i18n:lngs:remove',
          title: 'Remove list of languages',
          groups: [],
          parents: ['modules:devtools', 'modules:devtools:i18n'],
          description: 'Remove one or multiple i18n files',
          middlewares: [
            validate(removeLngsSchema),
            nsCtrls.check,
            ctrls.removeLngs,
          ],
        },
      },
    },
  ],
};

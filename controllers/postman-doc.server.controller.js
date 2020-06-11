const uuid = require('uuid');
const { resolve, relative } = require('path');
const { render } = require('nunjucks');
const debug = require('debug')('modules:postman:doc');
const { locate } = require('func-loc');
const esprima = require('esprima');
const { readFile, writeFile } = require('fs');
const { promisify } = require('util');
const doctrine = require('doctrine');
const { isExcluded } = require('@helpers/utils');

let postmanVariables;

try {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  postmanVariables = require(resolve('.env/postman-variables'));
} catch (e) {
  postmanVariables = {};
}

const {
  app,
  files,
  devtools,
  // eslint-disable-next-line import/no-dynamic-require
} = require(resolve('config'));
const { prefix } = app;
// eslint-disable-next-line import/no-unresolved
const { getBaseURLFromRequest } = require('utils');

const readFile$ = promisify(readFile);
const cachePath = resolve(__dirname, '../.cache/postman.collection.json');
const statusCodes = require('../helpers/status-codes.server.helper');
const filesProvider = require('../helpers/files-provider.server.helper');

const { link: repoLink, type: repoType = 'local' } = devtools.repository;
const HTTP_METHODS = ['get', 'post', 'put', 'delete'];

exports.downloadJSON = function downloadJSON(res, json, ext = '.postman_collection.json') {
  res
    .set('content-type', 'application/octet-stream')
    .set('content-disposition', `attachment;filename=${app.title}${ext}`)
    .send(JSON.stringify(json));
};

function normalizeObjArray(obj) {
  if (Array.isArray(obj)) {
    return obj;
  }

  return Object.keys(obj || {}).map((attr) => ({
    key: attr,
    value: obj[attr],
  }));
}

function addToVariables(variable, list) {
  const found = list.find((item) => item.key === variable.key);

  if (found) {
    return list;
  }

  list.push(variable);
  return list;
}

const tagsManifest = [
  {
    tag: 'example',
    formatter: (v) => {
      const json = JSON.parse(v);

      ['request', 'response'].forEach((attr) => {
        if (!json[attr]) {
          return;
        }
        const { body, headers = [], params = [] } = json[attr];
        json[attr].body = JSON.stringify(body, null, '  ') || '';
        json[attr].headers = normalizeObjArray(headers);

        if (!json[attr].headers.find((h) => h.key.toLowerCase() === 'content-type')) {
          json[attr].headers.push({
            key: 'Content-Type',
            value: 'application/json',
          });
        }

        switch (attr) {
          case 'request':
            json[attr].params = normalizeObjArray(params);
            break;
          case 'response':
            json[attr].status = json[attr].status || 200;
            break;
          default:
            break;
        }
        json[attr].params = normalizeObjArray(params);
      });

      return json;
    },
  },
  {
    tag: 'headers',
    isOne: true,
    formatter: (v) => {
      const json = JSON.parse(v);
      return normalizeObjArray(json);
    },
  },
  {
    tag: 'body',
    isOne: true,
  },
  {
    tag: 'json',
    isOne: true,
  },
  {
    tag: 'urlencoded',
    isOne: true,
  },
  {
    tag: 'formdata',
    isOne: true,
  },
  {
    tag: 'bodyMode',
    isOne: true,
  },
  {
    tag: 'test',
    isOne: true,
  },
  {
    tag: 'params',
    isOne: true,
    formatter: (v) => {
      const json = JSON.parse(v);
      return normalizeObjArray(json);
    },
  },
];

/**
 * IAM & description & middlewares
 */
exports.description = async (obj) => {
  const { description = 'Not specified', iam } = obj;
  let { middlewares = [], parents = [] } = obj;
  const exclude = await isExcluded(obj);

  middlewares = middlewares.map(async (m) => {
    const loc = await locate(m);
    return { ...loc, ref: m };
  });

  middlewares = await Promise.all(middlewares);
  middlewares = middlewares.map((loc) => {
    const {
      source = '', line, ref, col,
    } = loc;

    const name = ref.name || 'anonymous';

    // Construct the link
    let link = source.replace(/^file:\/\//, '');
    link = relative(resolve(), link);

    if (typeof filesProvider[repoType] !== 'function') {
      return { name };
    }

    return {
      link: filesProvider[repoType](repoLink, {
        source: link,
        line,
        col,
      }),
      name,
    };
  });
  // parents
  parents = parents.map(async (p) => ({ ref: p }));
  parents = await Promise.all(parents);

  return render(resolve(__dirname, '../views/request-description.server.view.swig'), {
    iam,
    parents,
    exclude,
    description,
    middlewares,
  });
};

/**
 * Extract method by Lines
 */
exports.methods = ({ body = [] }) => {
  if (!Array.isArray(body)) {
    return [];
  }

  const routesProperty = body
    // Filter expression statments only
    .filter((item) => item.type === 'ExpressionStatement')
    // Map on right properties
    .map((item) => item.expression.right.properties)
    .filter(Boolean)
    // Find "routes" property
    .find((properties) => properties.find((p) => p.key.name === 'routes'));

  if (!routesProperty) {
    return [];
  }

  return (
    routesProperty
      // Select routes
      .find((p) => p.key.name === 'routes')
      .value.elements // Get object expressions only
      .filter((el) => el.type === 'ObjectExpression')
      // Map on the properties and ignore the rest
      .map((el) => el.properties)
      // Select "methods" attribute
      .map((properties) => properties.find((p) => p.key.name === 'methods'))
      // Ignore other properties
      .filter(Boolean)
      // Select the properties
      .map((p) => p.value.properties
        .map((item) => ({
          method: item.key.name,
          location: item.key.loc.start.line,
        }))
        .filter((item) => HTTP_METHODS.includes(item.method)))
      // Flatten the result
      .flat()
  );
};

/**
 *
 */
exports.examples = (baseRequest, examples) => examples.map((example) => {
  const { request = {}, response = {}, name = uuid.v4() } = example;
  return {
    name,
    originalRequest: {
      name: baseRequest.name,
      method: baseRequest.method,
      header: request.headers || baseRequest.header,
      body: request.body
        ? {
          mode: 'raw',
          raw: request.body,
        }
        : baseRequest.body,
      url: {
        ...baseRequest.url,
        query: request.params || baseRequest.params,
      },
    },
    code: response.status,
    status: statusCodes[`${response.status}`],
    header: response.headers,
    _postman_previewlanguage: 'json',
    body: response.body,
  };
});

/**
 * Extract comments of each method
 */
exports.comments = ({ comments = [] }, file, doc) => {
  if (!Array.isArray(comments)) {
    return [];
  }

  // doc of the method required
  return (
    comments
      .filter((c) => c.type === 'Block')
      .map((c) => {
        // Extract variables
        const regex = /{{(\w*)}}/gm;
        let exec;
        do {
          exec = regex.exec(c.value);
          if (exec) {
            addToVariables(
              {
                id: uuid.v4(),
                key: exec[1],
                value: postmanVariables[exec[1]] || '',
                type: 'string',
              },
              doc.variable,
            );
          }
        } while (exec);

        // Extract tags
        const { tags } = doctrine.parse(c.value, { unwrap: true });

        // Construct the data object
        const data = tags.reduce((previous, { title, description }) => {
          const result = previous;
          const meta = tagsManifest.find((one) => one.tag === title);

          if (!meta) {
            result[title] = previous[title] || [];
            result[title].push(description);
            return result;
          }

          if (meta.isOne && result[title]) {
            debug(`Tag skipped.
Reason  : Multiple values.
Tag     : "${title}"
Value   : "${description}"
Location: ${file}:${c.loc.end.line}
`);
            return result;
          }

          let value = description;

          if (typeof meta.formatter === 'function') {
            try {
              value = meta.formatter(description);
            } catch (e) {
              debug(`Tag skipped.
Reason  : Invalid tag value.
Tag     : "${title}"
Value   : "${description}"
Location: ${file}:${c.loc.end.line}
`);
              return result;
            }
          }

          if (meta.isOne) {
            result[title] = value;
          } else {
            result[title] = result[title] || [];
            result[title].push(value);
          }

          return result;
        }, {});

        // return formatted result
        return {
          tags: data,
          location: c.loc.end.line,
        };
      })
      // return only blocks that contains at least one tag
      .filter((obj) => Object.keys(obj.tags).length > 0)
  );
};

/**
 * Get the collection from cache
 * @controller Get doc from cache
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.cache = async function cache(req, res, next) {
  const { force, download } = req.query;

  if (force === 'true') {
    return next();
  }

  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const json = require(cachePath);

    if (download !== 'true') {
      return res.json(json);
    }

    return exports.downloadJSON(res, json);
  } catch (e) {
    return next();
  }
};

/**
 * Extract route data from an IAM object
 * @param {String} path The path of the IAM file
 * @param {String} method The HTTP method
 * @param {Object} obj The IAM method object
 * @param {Object} doc The current doc
 * @param {Object} parent The IAM module
 * @returns {Array} List of routes in postman format
 */
exports.extract = async (path, method, obj, doc, parent) => {
  const { title: name = 'Not specified' } = obj;
  const regex = /^:(\w*)(\(.*\))?/;

  const pathItems = path
    .split('/')
    .filter((p, index, arr) => (index < arr.length - 1 ? Boolean(p) : true))
    .map((p) => {
      const exec = regex.exec(p);
      if (exec) {
        const [,varName] = exec;

        addToVariables(
          {
            id: uuid.v4(),
            key: varName,
            value: postmanVariables[varName] || '',
            type: 'string',
          },
          doc.variable,
        );

        return `{{${varName}}}`;
      }

      return p;
    });

  const result = {
    name,
    response: [],
    event: [],
    request: {
      method,
      description: await exports.description(obj),
      body: {
        mode: 'raw',
        raw: method === 'GET' ? '' : '{}',
      },
      url: {
        host: [`{{host}}${parent.is_global ? '': '{{prefix}}'}`],
        path: pathItems,
      },
    },
  };

  const { found } = await isExcluded(obj);

  if (found) {
    result.name = `[EXCLUDED] ${result.name}`;
    result.excluded = true;
  }

  return result;
};

/**
 * Extract routes from IAM file
 * @param {String} filePath Absolute path of the IAM file
 */
exports.extractRoutes = async (filePath, doc) => {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const m = require(resolve(filePath));
  const { prefix: routePrefix, routes = [] } = m;
  let list = routes.map(async (r) => {
    const { path, methods = {} } = r;
    let methodsArr = Object.keys(methods)
      .filter((method) => HTTP_METHODS.includes(method))
      .map(async (method) => {
        const result = await exports.extract(
          `${routePrefix}${path}`,
          method.toUpperCase(),
          methods[method],
          doc,
          m,
        );
        return result;
      });

    methodsArr = await Promise.all(methodsArr);

    return methodsArr;
  });
  list = await Promise.all(list);
  list = Array.prototype.concat.apply([], list);
  return list;
};

/**
 * Extract comments and add them to the list
 */
exports.extractComments = async (filePath, requests, doc) => {
  // read iam file
  const content = await readFile$(filePath, 'utf8');
  // produce syntax tree
  const parsedScript = esprima.parseScript(content, { loc: true, comment: true });
  // all comments with their ending lines
  const comments = exports.comments(parsedScript, filePath, doc);
  const methods = exports.methods(parsedScript, filePath, doc);

  if (methods.length !== requests.length) {
    debug(`Number of methods is # to number of requests
File: ${filePath}    
`);
  }

  return requests
    .filter((req) => devtools.addExcluded || !req.excluded)
    .map((req, index) => {
      const obj = req;
      const { request } = obj;
      const method = methods[index];
      const comment = comments.find((c) => c.location === method.location - 1);

      delete obj.excluded;

      if (typeof filesProvider[repoType] === 'function') {
        let { description } = req.request;

        description = description
          .replace(/^\*\*IAM\*\*: `(.*)`/m, `**IAM**: [\`$1\`](${
            filesProvider[repoType](repoLink, {
              source: filePath,
              line: method.location,
            })
          })`);

        req.request.description = description;
      }

      if (!comment) {
        return obj;
      }

      const { tags } = comment;

      if (tags.body || tags.bodyMode) {
        const mode = tags.bodyMode || 'raw';

        request.body = { mode };

        if (mode === 'raw') {
          request.body.raw = tags.body;
        } else {
          try {
            request.body[mode] = JSON.parse(tags[mode] || tags.body || '');
          } catch (e) {
            debug(
              'Unable to parse the request body of',
              req.request.method,
              `/${req.request.url.path.join('/')}`,
            );
          }
        }
      }

      // Set the headers
      request.headers = tags.headers || [];
      if (['POST', 'PUT'].includes(request.method)) {
        const found = request.headers.find((h) => h.key.toLowerCase() === 'content-type');
        if (!found) {
          request.headers.push({
            key: 'Content-Type',
            value: 'application/json',
          });
        }
      }

      // Set tests
      if (tags.test) {
        obj.event.push({
          listen: 'test',
          script: {
            id: uuid.v4(),
            exec: [tags.test],
            type: 'text/javascript',
          },
        });
      }

      // set prerequests
      if (tags.prerequest) {
        obj.event.push({
          listen: 'prerequest',
          script: {
            id: uuid.v4(),
            exec: tags.prerequest,
            type: 'text/javascript',
          },
        });
      }

      // Set query params
      if (tags.params) {
        request.url.query = tags.params;
      }

      // Set examples
      if (Array.isArray(tags.example)) {
        obj.response = exports.examples(request, tags.example);
      }

      return obj;
    });
};

/**
 * Will initialize the result object
 * @controller Init
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.init = async function init(req, res, next) {
  req.doc = {};
  return next();
};

/**
 * Will add the info bloc to the result
 * @controller Info
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.info = async function info(req, res, next) {
  const { doc } = req;

  doc.info = {
    _postman_id: uuid.v4(),
    name: app.title || '',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  };

  doc.info.description = render(resolve(__dirname, '../views/api-description.server.view.swig'), {
    description: app.description || '',
  });

  return next();
};

/**
 * Will add the variable block to the result
 * @controller Variable
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.variable = async function variable(req, res, next) {
  const { doc } = req;

  doc.variable = [
    {
      id: uuid.v4(),
      key: 'host',
      value: getBaseURLFromRequest(req),
      type: 'string',
    },
    {
      id: uuid.v4(),
      key: 'prefix',
      value: prefix,
      type: 'string',
    },
  ];

  return next();
};

/**
 * Will add the item block to the result
 * @controller Items
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.items = async function getItems(req, res, next) {
  const { doc } = req;
  // Regular expression to extract
  const regex = /^(?<type>[^/]*)\/(?<module>[^/]*).*\/(?<name>[^/]*)\.js$/;

  // Group iam by type and module name
  let items = files.server.iam.map(async (current) => {
    const exec = regex.exec(current);

    // Skip files that does not match the regular expression
    if (!exec) {
      debug('File does not match the regular expression');
      return null;
    }

    const { type, module, name } = exec.groups;

    const requests = await exports.extractRoutes(current, doc);
    const requestsComments = await exports.extractComments(current, requests, doc);

    return {
      type,
      module,
      name: name.replace(/\.server\.iam$/, ''),
      requestsComments,
    };
  });

  items = await Promise.all(items);
  items = items.filter(Boolean);

  // Group requests by types and modules
  doc.item = items.reduce((arr, {
    type, module, name, requestsComments,
  }) => {
    // Find the "type" item, add it to the result if does not exist
    let typeItem = arr.find((one) => one.name === type);

    if (!typeItem) {
      typeItem = { name: type, item: [] };
      arr.push(typeItem);
    }

    // Find the "module" item inside the "type" folder, add it if does not exist
    let moduleItem = typeItem.item.find((one) => one.name === module);

    if (!moduleItem) {
      moduleItem = { name: module, item: [] };
      typeItem.item.push(moduleItem);
    }

    // Add requests to the module folder
    moduleItem.item.push({
      name,
      item: requestsComments,
    });

    return arr;
  }, []);

  // Create the file and cache the result
  writeFile(cachePath, JSON.stringify(req.doc), (err) => {
    if (err) throw err;
  });

  return next();
};

/**
 * Returns the result to the client
 * @controller Result
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.result = async function result(req, res) {
  const { download = false } = req.query;

  if (download !== 'true') {
    res.json(req.doc);
  } else {
    exports.downloadJSON(res, req.doc);
  }
};

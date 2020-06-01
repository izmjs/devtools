const { v4 } = require('uuid');
const { resolve } = require('path');
const { promisify } = require('util');
const {
  app,
  devtools,
} = require('@config/index');

const docCtrls = require('./postman-doc.server.controller');

const { Collection } = require('../helpers/postman.server.helper');

const cachePath = resolve(__dirname, '../.cache/postman.collection.json');

const { postman } = devtools;
const collectionInstance = new Collection();

if (postman && postman.key) {
  collectionInstance.setKey(postman.key);
}

/**
 * Check postman key
 * @controller Check the key
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.checkKey = async function checkKey(req, res, next) {
  if (!postman || !postman.key) {
    return res.status(400).json({
      message: req.t('POSTMAN_KEY_NOT_FOUND'),
    });
  }

  return next();
};

/**
 * List of all postman collections that are accessible by you.
 * @controller List postman collections
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.list = async function list(req, res) {
  try {
    const result = await collectionInstance.all();
    return res.json(result);
  } catch (e) {
    return res.status(400).json(e);
  }
};

/**
 * Create new postman collection
 * @controller Create postman collection
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.create = async function create(req, res) {
  let collection;

  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    collection = require(cachePath);

    if (!collection) {
      return res.status(400).json({
        message: req.t('CACHE_NOT_FOUND'),
      });
    }
  } catch (e) {
    return res.status(400).json({
      message: req.t('CACHE_NOT_FOUND'),
    });
  }

  try {
    const result = await collectionInstance.create(collection);
    return res.json(result);
  } catch (e) {
    return res.status(400).json(e);
  }
};

/**
 * Check cache
 * @controller Check cache
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.isCached = async function isCached(req, res, next) {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    req.collection = require(cachePath);
    return next();
  } catch (e) {
    // Do nothing
  }

  // Generate the doc if it does not exist
  try {
    await Promise.all([
      promisify(docCtrls.init)(req, res),
      promisify(docCtrls.info)(req, res),
      promisify(docCtrls.variable)(req, res),
      promisify(docCtrls.items)(req, res),
    ]);
  } catch (e) {
    return res.status(400).json({
      message: req.t('CACHE_NOT_FOUND'),
    });
  }

  req.collection = req.doc;
  return next();
};

/**
 * Update the collection in postman
 * @controller Update postman collection
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.sync = async function sync(req, res) {
  if (!postman || !postman.key) {
    return res.status(400).json({
      message: req.t('POSTMAN_KEY_NOT_FOUND'),
    });
  }

  const { collection, params } = req;
  const { collectionId: id } = params;

  try {
    const result = await collectionInstance.update(id, collection);
    return res.json(result);
  } catch (e) {
    return res.status(400).json(e);
  }
};

/**
 * Extract variables from cached doc
 * @controller Extract variable
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.variables = async function variables(req, res) {
  const { collection, query } = req;
  const { variable = [] } = collection;
  const { download = false } = query;

  let defaults = {};

  try {
    // eslint-disable-next-line
    defaults = require(resolve('.env/.defaults.json'));
  } catch (e) {
    // Do nothing
  }

  const json = {
    id: v4(),
    name: `[${(process.env.NODE_ENV || 'development').toUpperCase()}] ${app.title || 'api'}`,
    _postman_variable_scope: 'environment',
    values: variable.map((v) => ({
      key: v.key,
      value: v.value || defaults[v.key] || '',
      enabled: true,
      description: {
        content: '',
        type: 'text/plain',
      },
    })),
  };

  if (download !== 'true') {
    res.json(json);
  } else {
    docCtrls.downloadJSON(res, json, '.postman_environment.json');
  }
};

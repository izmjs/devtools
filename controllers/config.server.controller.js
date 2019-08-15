const { resolve } = require('path');

// eslint-disable-next-line import/no-dynamic-require
const { env } = require(resolve('config')).utils;

/**
 * List config fields
 * @controller List
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.list = async function list(req, res) {
  res.json(env.toJSON());
};

/**
 * Preview env file
 * @controller Preview
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.preview = async function preview(req, res) {
  res.set('Content-Type', 'text/plain');
  res.send(env.toString());
};

/**
 * Set
 * @controller Edit env variables
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.set = async function set(req, res) {
  const { body: items } = req;
  const errors = {};

  items.forEach((item) => {
    const itemTmp = item;
    const {
      key,
      value,
      remove,
      scope = 'general',
    } = item;
    const field = env.variables.find(v => v.key === key && v.scope === scope);
    if (!field) {
      errors[key] = {
        exist: false,
      };
      return;
    }

    if (!remove && !field.validate(value)) {
      errors[key] = field.validator.errors;
      return;
    }

    itemTmp.field = field;
  });

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  items.forEach((item) => {
    if (item.remove) {
      item.field.reset();
      return;
    }
    item.field.setValue(item.value);
  });
  const saved = await env.save();
  if (saved) {
    return res.json({
      message: req.t('CONFIG_SET_SAVED_SUCCESSFULLY'),
    });
  }

  return res.json({
    message: req.t('CONFIG_SET_NOT_SAVED'),
  });
};

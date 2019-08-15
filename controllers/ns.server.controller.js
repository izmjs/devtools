const { resolve } = require('path');

/**
 * Check if the namespace deos exist
 * @controller Check
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.check = async function check(req, res, next) {
  const { query, i18n } = req;
  const { ns: namespaces = [] } = i18n.options;
  const { ns } = query;

  if (!ns) {
    return res.status(400).json({
      message: req.t('I18N_NAMESPACE_NO_SPECIFIED'),
    });
  }

  // return a not found result if the namespace is not supported
  if (!ns || !namespaces.includes(ns)) {
    return res.status(404).json({
      message: req.t('I18N_NAMESPACE_NOT_FOUND'),
    });
  }

  req.nsBaseFolder = resolve(ns.split(':').join('/'));

  return next();
};

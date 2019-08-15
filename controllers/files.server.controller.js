const { exists: fsExists } = require('fs');
const { promisify } = require('util');
const { spawn } = require('child_process');
const { resolve, relative } = require('path');
const launchEditor = require('react-dev-utils/launchEditor');
const { platform } = require('os');

const exists$ = promisify(fsExists);

/**
 * Check the existance of a file
 * @controller Check file exists
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.exists = async function exists(req, res, next) {
  const { file = '', line = 1, col = 0 } = req.query;

  if (!file) {
    return res.status(404).json({
      message: req.t('FILE_DOES_NOT_EXIST'),
    });
  }

  const relativePath = relative(resolve(), file);

  if (!file || relativePath.startsWith('..')) {
    return res.status(404).json({
      message: req.t('FILE_DOES_NOT_EXIST'),
    });
  }

  try {
    const isExist = await exists$(resolve(file));

    if (!isExist) {
      return res.status(404).json({
        message: req.t('FILE_DOES_NOT_EXIST'),
      });
    }
  } catch (e) {
    return res.status(404).json({
      message: req.t('FILE_DOES_NOT_EXIST'),
    });
  }

  req.location = {
    file: resolve(file),
    line: line ? Number.parseInt(line, 10) : 1,
    col: col ? Number.parseInt(col, 10) : 0,
  };

  return next();
};

/**
 * Open file in default editor
 * @controller Open file
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.open = async function open(req, res) {
  const { file, line, col } = req.location;
  launchEditor(file, line, col);

  return res.status(200).format({
    'text/html': () => res.render(resolve(__dirname, '../views/file-opener')),
    'application/json': () => res.status(204).end(),
  });
};

/**
 * Edit project
 * @controller Edit project
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.edit = async function edit(req, res) {
  const { isAdd = 'false' } = req.query;
  const code = spawn(
    platform().startsWith('win') ? 'code.cmd' : 'code',
    [isAdd === 'true' ? '-a' : '', resolve('.')],
  );

  code.on('error', (data) => {
    res.status(400).json({
      message: req.t('FILES_CANNOT_OPEN_VSCODE'),
      data,
    });
  });

  code.on('close', (status) => {
    if (status >= 0) {
      res.status(204).end();
    }
  });
};

/**
 * Check the namespace
 * @controller Check NS
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.checkNS = async function checkNS(req, res, next) {
  const { query, i18n } = req;
  const { ns: namespaces = [] } = i18n.options;
  const { ns, file } = query;

  if (!file) {
    return res.status(404).json({
      message: req.t('FILE_DOES_NOT_EXIST'),
    });
  }

  if (!ns) {
    return next();
  }

  // return a not found result if the namespace is not supported
  if (!namespaces.includes(ns)) {
    return res.status(404).json({
      message: req.t('I18N_NAMESPACE_NOT_FOUND'),
    });
  }

  const baseFolder = resolve(...ns.split(':'));
  const fileFullPath = resolve(baseFolder, file);
  const relativePath = relative(baseFolder, fileFullPath);

  if (relativePath.startsWith('..')) {
    return res.status(404).json({
      message: req.t('FILE_DOES_NOT_EXIST'),
    });
  }

  query.file = relative(resolve(), fileFullPath);

  return next();
};

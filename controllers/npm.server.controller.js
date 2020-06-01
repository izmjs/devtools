const npmSearch = require('libnpmsearch');
const { resolve } = require('path');
const { promisify } = require('util');
const {
  rename,
  readFile,
  writeFile,
  createReadStream,
} = require('fs');
const tar = require('tar');
const { publish: publish$ } = require('libnpmpublish');

const config = require('@config/index');
const npmHelper = require('../helpers/npm.server.helper');

const { npm: npmConfig } = config.devtools;
const { env } = config.utils;

const writeFile$ = promisify(writeFile);
const readFile$ = promisify(readFile);

/**
 * Search a module
 * @controller Search
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.search = async function search(req, res, next) {
  const { $top = 10, $skip = 0, text = 'express' } = req.query;

  if (!text) {
    return res.status(400).json({
      message: req.t('NPM_SEARCH_TEXT_MONDATORY'),
    });
  }

  try {
    const result = await npmSearch(text, {
      limit: $top,
      from: $skip,
    });

    return res.json(result);
  } catch (e) {
    return next(e);
  }
};

/**
 * Get current module metadata
 * @controller Current module metadata
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.meta = async function meta(req, res) {
  return res.json(req.pkg);
};

/**
 * Set current module metadata
 * @controller Set current module metadata
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.setMeta = async function setMeta(req, res, next) {
  const { body, pkg } = req;

  req.pkg = {
    ...pkg,
    ...body,
  };

  return next();
};

/**
 * Load package.json files
 * @controller Load package
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.loadPackageJson = async function loadPackageJson(req, res, next) {
  const { nsBaseFolder } = req;
  const pkgPath = resolve(nsBaseFolder, 'package.json');

  let pkg = {};

  try {
    const content = await readFile$(pkgPath, 'utf8');
    pkg = JSON.parse(content);
  } catch (e) {
    // Proceed
    // return res.status(400).json({
    //   message: req.t('INVALID_PACKAGE_JSON'),
    // });
  }

  req.pkg = pkg;
  return next();
};

/**
 * Save package.json file
 * @controller Save package
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.savePackageJson = async function savePackageJson(req, res) {
  const { pkg, nsBaseFolder } = req;
  const pkgPath = resolve(nsBaseFolder, 'package.json');

  try {
    await writeFile$(pkgPath, JSON.stringify(pkg, null, '  '));
  } catch (e) {
    return res.status(400).json({
      message: req.t('IMPOSSIBLE_WRITE_PACKAGE_JSON'),
    });
  }

  return res.status(204).end();
};

/**
 * Get installed packages
 * @controller Get installed
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.installed = async function installed(req, res) {
  const { nsBaseFolder, query, pkg } = req;
  const { mode = 'fm' } = query;
  const allowedModes = ['fm', 'dev', 'prod'];

  if (allowedModes.indexOf(mode) < 0) {
    return res.status(400).json({
      message: req.t('UN_ALLOWED_NPM_MODE'),
    });
  }

  if (mode === 'fm') {
    const result = Object
      .keys(pkg.fmDependecies || {})
      .map((one) => ({
        name: one,
        from: `${one}@${pkg.fmDependecies[one]}`,
        version: pkg.fmDependecies[one],
      }));

    return res.json(result);
  }

  const list = await npmHelper.list(nsBaseFolder, mode);
  return res.json(list);
};

/**
 * Install module
 * @controller Install
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.install = async function install(req, res) {
  const { nsBaseFolder, body } = req;
  const { mode = 'prod', name, version = 'latest' } = body;
  try {
    await npmHelper.install(name, version, nsBaseFolder, mode);
  } catch (e) {
    return res.status(400).json({
      message: req.t('CANNOT_INSTALL_NPM_MODULE'),
    });
  }

  return res.status(204).end();
};

/**
 * Publish a functional module
 * @controller Publish FM
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.publish = async function publish(req, res) {
  const { name, version } = req.body;
  const {
    npm,
    tarPath,
    pkg: json,
    nsBaseFolder,
  } = req;
  const pkgPath = resolve(nsBaseFolder, 'package.json');

  if (
    (name && json.name !== name)
    || (version && json.version !== version)
  ) {
    try {
      json.name = name || json.name;
      json.version = version || json.version;
      await writeFile$(pkgPath, JSON.stringify(json, null, '  '));
    } catch (e) {
      // Do nothing, just skip
    }
  }

  try {
    await publish$(
      json,
      createReadStream(tarPath), {
        npmVersion: `${json.name}@${json.version}`,
        ...npm,
      },
    );
    return res.status(204).end();
  } catch (e) {
    return res.status(400).json({
      message: req.t('NPM_REGISTRY_ERROR', {
        msg: e.message,
      }),
    });
  }
};

/**
 * Download a functional module
 * @controller Download FM
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.downloadFM = async function downloadFM(req, res) {
  const { name, version, target = name } = req.body;
  let stream;

  try {
    stream = await npmHelper.download(name, version);
  } catch (e) {
    return res.status(400).json({
      message: req.t('NPM_REGISTRY_ERROR', {
        msg: e.message,
      }),
    });
  }

  stream.pipe(
    tar.extract({
      cwd: 'modules',
    }),
  );

  stream.on('close', () => {
    rename(
      resolve('modules/package'),
      resolve(`modules/${target}`),
      () => { },
    );
    res.status(204).end();
  });

  return true;
};

/**
 * Remove a module
 * @controller Remove module
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.removeModule = async function removeModule(req, res) {
  res.status(400).json({
    message: req.t('NOT_IMPLEMENTED'),
  });
};

/**
 * Remove a functional module
 * @controller Remove FM
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.removeFM = async function removeFM(req, res) {
  res.status(400).json({
    message: req.t('NOT_IMPLEMENTED'),
  });
};

/**
 * Audit dependencies
 * @controller Audit
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.audit = async function audit(req, res) {
  res.status(400).json({
    message: req.t('NOT_IMPLEMENTED'),
  });
};

/**
 * Load NPM config
 * @controller Load
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.load = async function load(req, res, next) {
  let { registry: r, username: u, password: p } = npmConfig;
  const {
    save,
    username,
    password,
    registry,
  } = req.body;

  const authStr = `${username || u}:${password || p}`;

  r = r || registry;
  u = u || username;
  p = p || password;

  const loadConfig = {
    registry: r,
  };

  loadConfig[`${r.replace(/^http[s]{0,1}:/, '')}:_authToken`] = false;

  if (u && p) {
    // eslint-disable-next-line no-underscore-dangle
    loadConfig._auth = Buffer.from(authStr).toString('base64');
  }

  req.npm = {
    ...req.npm,
    username: u,
    password: p ? Buffer.from(p).toString('base64') : '',
    registry: r,
  };

  if (save === true) {
    for (let i = 0; i < env.variables.length; i += 1) {
      const v = env.variables[i];

      if (username && v.key === 'NPM_USERNAME' && v.scope === 'devtools') {
        v.setValue(username);
      } else if (password && v.key === 'NPM_PASSWORD' && v.scope === 'devtools') {
        v.setValue(password);
      } else if (registry && v.key === 'NPM_REGISTRY' && v.scope === 'devtools') {
        v.setValue(registry);
      }
    }
  }

  return next();
};

/**
 * Check dependencies updates
 * @controller Check updates
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.checkUpdates = async function checkUpdates(req, res) {
  res.status(400).json({
    message: req.t('NOT_IMPLEMENTED'),
  });
};

/**
 * Tarball the functional module
 * @controller Tar
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.tarball = async function tarball(req, res, next) {
  const { nsBaseFolder } = req;
  const targetFolder = resolve(__dirname, '../.cache');
  const {
    pkg,
    code,
    data,
    error,
    target,
    success,
  } = await npmHelper.pack(nsBaseFolder, targetFolder);

  if (!success) {
    if (code) {
      return res.status(400).json({
        message: req.t(code, data),
      });
    }
    return next(error);
  }

  req.tarPath = target;
  req.pkg = pkg;
  return next();
};

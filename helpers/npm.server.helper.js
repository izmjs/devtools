const http = require('http');
const https = require('https');
const request = require('request');
const { platform } = require('os');
const { resolve } = require('path');
const { promisify } = require('util');
const { spawn } = require('child_process');
const {
  rename,
  readFile,
} = require('fs');

const npmCmd = platform().startsWith('win') ? 'npm.cmd' : 'npm';
const installedCache = {};

const rename$ = promisify(rename);
const readFile$ = promisify(readFile);
const spawn$ = (...args) => new Promise((done, reject) => {
  const cmd = spawn(...args);
  let result = '';

  if (cmd.stdout) {
    cmd.stdout.on('data', (data) => {
      result += data;
    });
  } else {
    cmd.on('data', (data) => {
      result += data;
    });
  }

  cmd.on('error', reject);
  cmd.on('close', () => done(result.trim()));
});

const request$ = (options) => new Promise((cb, reject) => request(
  options,
  (error, response, body) => {
    if (error) {
      return reject(error);
    }

    return cb({
      response,
      body,
    });
  },
));

exports.npmCmd = npmCmd;

/**
 * Get tarball link of a specific module
 * @param {String} moduleName The module name
 * @param {String} version The module version
 * @returns {Promise} The tarball link
 */
exports.view = async (moduleName, version = 'latest') => {
  const result = await spawn$(npmCmd, [
    'view',
    `${moduleName}@${version}`,
    'dist.tarball',
  ]);

  return result;
};

/**
 * Download the tarball of a specific module
 * @param {String} moduleName The module name
 * @param {String} version The module version
 */
exports.download = (moduleName, version = 'latest') => new Promise((done) => {
  exports
    .view(moduleName, version)
    .then((url) => {
      (url.startsWith('https') ? https : http).request(
        url,
        done,
      ).end();
    });
});

/**
 * Pack a module and move it to target path
 * @param {String} moduleFolder The module base path
 * @param {String} target The target file
 */
exports.pack = async (moduleFolder, target) => {
  const pkgPath = resolve(moduleFolder, 'package.json');
  let pkg;

  try {
    await spawn$(npmCmd, ['pack'], {
      cwd: moduleFolder,
    });
  } catch (e) {
    return {
      success: false,
      code: 'ERROR_TAR',
      error: e,
      data: null,
    };
  }

  try {
    const content = await readFile$(pkgPath, 'utf8');
    pkg = JSON.parse(content);
  } catch (e) {
    return {
      success: false,
      code: 'INVALID_PACKAGE_JSON',
      error: e,
      data: null,
    };
  }

  const newName = resolve(target, `${pkg.name}.tgz`);

  try {
    await rename$(
      resolve(moduleFolder, `${pkg.name}-${pkg.version}.tgz`),
      newName,
    );
  } catch (e) {
    return {
      success: false,
      error: e,
    };
  }

  return {
    success: true,
    target: newName,
    pkg,
  };
};

/**
 * Install a module in a specific folder
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.install = (name, version = 'latest', folder = resolve(), mode = 'prod') => spawn$('npm', [
  'i',
  `${name}@${version}`,
  ['dev', 'prod'].indexOf(mode) >= 0 ? `--only=${mode}` : '',
], {
  cwd: folder,
  stdio: 'inherit',
});

/**
 * List installed modules
 * @param {String} folder The folder where to install the module
 */
exports.list = async (folder = resolve(), mode = 'prod') => {
  let json = {};
  const cache = installedCache[folder];

  if (cache && cache[mode]) {
    return cache[mode];
  }

  try {
    const content = await spawn$('npm', [
      'ls',
      '--depth=0',
      ['dev', 'prod'].indexOf(mode) >= 0 ? `--only=${mode}` : '',
      '--json',
    ], {
      cwd: folder,
    });

    json = JSON.parse(content);
    json.dependencies = Object.keys(json.dependencies)
      .map((name) => {
        let obj = json.dependencies[name];

        if (obj.required) {
          const { _from: from, version, _resolved: resolved } = obj.required;
          obj = { version, from, resolved };
        }

        return {
          name,
          ...obj,
        };
      });

    installedCache[folder] = installedCache[folder] || {};
    installedCache[folder][mode] = json.dependencies;
    return json.dependencies;
  } catch (e) {
    return [];
  }
};

/**
 * Get downloads number of a specific module
 * @param {String} next The module name
 */
exports.downloads = (module) => request$({
  url: `https://api.npmjs.org/downloads/point/last-week/${module}`,
  json: true,
}).then(({ body }) => body);

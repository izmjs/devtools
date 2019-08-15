// Global modules
const { readdir, stat } = require('fs');
const { promisify } = require('util');
const { resolve, basename, relative } = require('path');
const doc = require('documentation');

// Promisifying callback functions
const readdir$ = promisify(readdir);
const stat$ = promisify(stat);

/**
 * Extract controllers functions from a file
 * @param {String} file The full path of the file
 * @param {String} relativeTo The base folder
 */
exports.extract = async (file, regex, relativeTo = resolve()) => {
  // Build the current file
  const built = await doc.build(file, { shallow: true });

  // Extract the controllers from the file
  const found = built.filter(el => el.tags.find(t => t.title === 'controller'));

  // Convert found controllers to a more readable format
  const list = found.map((item) => {
    const { context } = item;
    // Extract the type, the name and the description
    const obj = {
      title: item.name,
      type: item.tags.find(p => p.title === 'controller').title,
      description: item.description.children[0].children[0].value,
    };

    if (context && context.loc && context.loc.start && context.file) {
      obj.path = relative(relativeTo, context.file);
      obj.loc = context.loc.start;
    }

    // Extract the controller title
    const ctrl = item.tags.find(p => p.title === 'controller');
    obj.name = ctrl.description || item.name;

    // Extract the parameters
    obj.params = item.tags
      .filter(t => t.title !== 'controller')
      .map(t => ({
        name: t.name,
        description: t.description,
        type: t.type.name,
      }));

    // return the transformed object
    return obj;
  });

  // return the list
  return list;
};

/**
 * Scan a folder and extract sub-folder, sub-files and controllers of each file
 * @param {String} folder The folder to scan
 * @param {Number} depth The depth to go through
 * @param {RegExp} regex Regular expression of the files to scan
 */
exports.scan = async ({
  folder = resolve('modules'),
  depth = -1,
  regex = /\.js$/,
  ignore = [],
  dotFiles = false,
  relativeTo = resolve('modules'),
}) => {
  // Read the base folder
  let list;
  let status;
  let devtools;

  try {
    // eslint-disable-next-line
    devtools = require(resolve(folder, '.devtools'))
  } catch (e) {
    devtools = {};
  }

  try {
    status = await stat$(folder);
  } catch (e) {
    return null;
  }

  if (status.isFile()) {
    const result = await exports.extract(folder, undefined, relativeTo);
    return result;
  }

  try {
    list = await readdir$(folder);
  } catch (e) {
    return null;
  }

  // Loop over the items of the base folder and contract the
  list = list.map(async (f) => {
    // Filter dot files
    if (!dotFiles && f.startsWith('.')) {
      return null;
    }

    const path = resolve(folder, f);
    const s = await stat$(path);

    // Initialize the result
    const obj = {
      name: basename(f),
      type: s.isDirectory() ? 'folder' : 'file',
      loaded: false,
      path: relative(relativeTo, resolve(folder, f)),
      children: [],
    };

    // Load the folder content
    if (obj.type === 'folder') {
      // check if the folder should be ignored
      const isToIgnore = ignore
        .concat(Array.isArray(devtools.ignore) ? devtools.ignore : [])
        .find((item) => {
          if (typeof item === 'string') {
            return item === obj.name;
          }

          if (item instanceof RegExp) {
            return item.test(obj.name);
          }

          return false;
        });

      // Return null if the folder should be ignored
      if (isToIgnore) {
        return null;
      }

      // The depth is different to 0, we should continue...
      if (depth !== 0) {
        obj.children = await exports.scan({
          depth: depth - 1,
          regex,
          ignore,
          folder: path,
          relativeTo,
        });
        obj.loaded = true;
      }
    } else {
      if (!regex.test(f)) {
        return null;
      }

      obj.children = await exports.extract(path, regex, relativeTo);
      obj.loaded = true;
    }

    return obj;
  });

  // Resolve the promises
  list = await Promise.all(list);

  // Filter empty objects
  list = list.filter(Boolean);

  // return the list
  return list;
};

/**
 * Extract and list controllers
 * @controller List controllers
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.list = async function list(req, res, next) {
  const { query, folder, baseFolder } = req;
  const { $depth = '0' } = query;

  try {
    const result = await exports.scan({
      ignore: ['.git', 'node_modules', 'public'],
      depth: Number.isNaN($depth) ? 0 : parseInt($depth, 10),
      folder,
      relativeTo: baseFolder,
    });

    if (!result) {
      return res.status(404).end();
    }
    return res.json(result);
  } catch (e) {
    return next(e);
  }
};

/**
 * Sanitizes the request
 * @controller Sanitize path
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.sanitize = async function sanitize(req, res, next) {
  const { $folder = '.', ns } = req.query;
  const baseFolder = resolve(ns.split(':').join('/'));
  const folder = resolve(baseFolder, $folder);

  if (!folder.startsWith(baseFolder)) {
    return res.status(400).json({
      message: req.t('INVALID_PATH'),
    });
  }
  req.folder = folder;
  req.baseFolder = baseFolder;
  return next();
};

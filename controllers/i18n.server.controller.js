const { promisify } = require('util');
const { resolve } = require('path');
const { writeFile, readFile, unlink } = require('fs');
const translate = require('translate');

const writeFile$ = promisify(writeFile);
const readFile$ = promisify(readFile);
const unlink$ = promisify(unlink);
// eslint-disable-next-line import/no-dynamic-require
const { translate: config } = require(resolve('config')).devtools;

const LANGUAGES_NAMES = require('../helpers/lng-names.server.helper');
// Support 10 Most Spoken Languages In The World
// https://www.babbel.com/en/magazine/the-10-most-spoken-languages-in-the-world/
const SUPPORTED_LANGUAGES = ['en', 'zh', 'hi', 'es', 'fr', 'ar', 'ru', 'bn', 'pt', 'id'];

/**
 * Get i18n of specific module
 * @controller List
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.list = async function list(req, res) {
  const { query, i18n } = req;
  const { ns } = query;

  const { backend } = i18n.services.backendConnector;
  const read$ = promisify(backend.read).bind(backend);

  // Create a set to eliminate dupplicated key
  const keys = new Set();

  // Loop over supported languages to find the files
  // Then create an array of promises
  let all = SUPPORTED_LANGUAGES
    .map((lng) => read$(lng, ns))
    .map((p$) => p$.catch(() => Promise.resolve(false)));

  // Resolve all promises at once
  all = await Promise.all(all);
  // Group translations by language
  all = all
    .map((obj, index) => {
      if (!obj) return false;
      Object.keys(obj).forEach((k) => keys.add(k));
      const key = SUPPORTED_LANGUAGES[index];
      return {
        key,
        ...LANGUAGES_NAMES[key],
        entries: obj,
      };
    })
    .filter(Boolean);

  // Create the languages array
  const lngs = all.map((lng) => ({
    key: lng.key,
    label: lng.name,
    name: lng.nativeName,
  }));

  // Create the entries
  const entries = all.reduce((prevValue, curValue) => {
    const { key, entries: entriesList } = curValue;
    Object.keys(entriesList).forEach((entryKey) => {
      let found = prevValue.find((one) => one.key === entryKey);

      if (!found) {
        found = {
          key: entryKey,
        };

        prevValue.push(found);
      }

      found[key] = entriesList[entryKey];
    });
    return prevValue;
  }, []);
  return res.json({ lngs, entries });
};

/**
 * Get list of available namespaces
 * @controller List namespaces
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.ns = async function getNamespaces(req, res) {
  const { ns = [] } = req.i18n.options;
  const result = ns
    .map((key) => {
      const [type, name] = key.split(':');
      return {
        key,
        name: `[${type}] ${name}`,
      };
    })
    .sort((a, b) => (a >= b ? 1 : -1));
  res.json(result);
};

/**
 * Add/Edit a i18n key
 * @controller Add/Edit
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.edit = async function edit(req, res) {
  const { body, query, i18n } = req;
  if (!Array.isArray(body)) {
    if (typeof body !== 'object' || !body || !body.key || typeof body.key !== 'string') {
      return res.status(400).json({
        message: req.t('I18N_INVALID_KEY'),
      });
    }
  }

  let entries = body;
  const cache = {};
  const { ns } = query;
  const { backend } = i18n.options;

  if (!Array.isArray(body)) {
    entries = [body];
  }

  // Sanitize received body, eliminated unsupported languages
  // Then fill the cache
  entries
    .filter((one) => typeof one === 'object' && one && one.key && typeof one.key === 'string')
    .forEach((one) => {
      const lngs = Object.keys(one).filter(
        (key) => key !== 'key' && typeof one[key] === 'string' && SUPPORTED_LANGUAGES.includes(key),
      );

      if (lngs.length === 0) {
        return;
      }

      lngs.forEach((lng) => {
        if (!cache[lng]) {
          cache[lng] = {
            entries: {},
          };

          try {
            cache[lng].path = backend.loadPath(lng, ns);
          } catch (e) {
            cache[lng].path = null;
          }
        }

        cache[lng].entries[one.key] = one[lng];
      });
    });

  const list$ = Object.keys(cache).map(async (lng) => {
    const { path, entries: list } = cache[lng];

    if (!path) {
      return false;
    }

    let content;
    let json = {};

    try {
      content = await readFile$(path, 'utf8');
      json = JSON.parse(content);
    } catch (e) {
      json = {};
    }

    try {
      await writeFile$(
        path,
        `${JSON.stringify(
          {
            ...json,
            ...list,
          },
          null,
          '  ',
        )}\n`,
        'utf8',
      );
    } catch (e) {
      // Do nothing
    }

    return json;
  });

  await Promise.all(list$);

  return res.status(204).end();
};

/**
 * Remove i18n key(s)
 * @controller Remove
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.remove = async function remove(req, res) {
  let { body = [] } = req;
  const { ns } = req.query;
  const { backend } = req.i18n.options;

  body = (Array.isArray(body) ? body : []).filter((key) => key && typeof key === 'string');

  if (body.length === 0) {
    return res.status(400).json({
      message: req.t('I18N_INVALID_KEY'),
    });
  }

  const list$ = SUPPORTED_LANGUAGES.map(async (lng) => {
    try {
      const path = backend.loadPath(lng, ns);
      const content = await readFile$(path, 'utf8');
      const json = JSON.parse(content);
      body.forEach((key) => {
        delete json[key];
      });
      await writeFile$(path, `${JSON.stringify(json, null, '  ')}\n`, 'utf8');
      return true;
    } catch (e) {
      return null;
    }
  });

  await Promise.all(list$);
  return res.status(204).end();
};

/**
 * Check translation engine
 * @controller Check translation engine
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.checkTranslateEngine = async function checkTranslateEngine(req, res, next) {
  const { engine, from } = config;
  const { code: to } = req.body;
  const { ns } = req.query;
  const { backend } = req.i18n.options;

  const path = backend.loadPath(from, ns);

  try {
    const content = await readFile$(path, 'utf8');
    JSON.parse(content);
  } catch (e) {
    try {
      await writeFile$(path, '{}', { encoding: 'utf8' });
    } catch (e1) {
      // Do nothing
    }
  }

  if (engine && !['google', 'yandex'].includes(engine)) {
    return res.status(400).json({
      message: req.t('I18N_TRANSLATION_UNSUPPORTED_ENGINE', {
        engine,
      }),
    });
  }

  if (!LANGUAGES_NAMES[from]) {
    return res.status(400).json({
      message: req.t('I18N_TRANSLATION_UNKNOWN_LANGUAGE_FROM', {
        lng: from,
      }),
    });
  }

  if (!SUPPORTED_LANGUAGES.includes(from)) {
    return res.status(400).json({
      message: req.t('I18N_TRANSLATION_UNSUPPORTED_LANGUAGE_FROM', {
        lng: LANGUAGES_NAMES[from].name,
      }),
    });
  }

  if (from === to) {
    return res.status(400).json({
      message: req.t('I18N_TRANSLATION_SAME_LANGUAGE'),
    });
  }

  return next();
};

/**
 * Translate i18n keys to a specific language
 * @controller Translate
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.translate = async function translateI18NFile(req, res) {
  const { key, engine, from } = config;
  const { code: to } = req.body;
  const { ns } = req.query;
  const { backend } = req.i18n.options;

  let jsonFrom;
  let jsonTo;
  const toPath = backend.loadPath(to, ns);

  try {
    const path = backend.loadPath(from, ns);
    const content = await readFile$(path, 'utf8');

    jsonFrom = JSON.parse(content) || {};
  } catch (e) {
    return res.status(400).json({
      message: req.t('I18N_TRANSLATION_CANNOT_READ_SOURCE'),
    });
  }

  if (Object.keys(jsonFrom).length === 0) {
    return res.status(400).json({
      message: req.t('I18N_TRANSLATION_EMPTY_SOURCE'),
    });
  }

  try {
    const content = await readFile$(toPath, 'utf8');

    jsonTo = JSON.parse(content) || {};
  } catch (e) {
    jsonTo = {};
  }

  const jsonFromKeys = Object.keys(jsonFrom);
  const jsonToKeys = Object.keys(jsonTo);

  let list$ = jsonFromKeys
    .filter((k) => !jsonToKeys.includes(k))
    .filter((k) => Boolean(jsonFrom[k]))
    .map(async (k) => {
      if (!key) {
        return {
          key: k,
          value: '',
        };
      }
      try {
        const text = await translate(jsonFrom[k], {
          to,
          key,
          from,
          engine,
        });
        return {
          key: k,
          value: text,
        };
      } catch (e) {
        return null;
      }
    });

  list$ = await Promise.all(list$);
  list$.filter((one) => !!one).forEach(({ key: k, value }) => {
    jsonTo[k] = value;
  });

  try {
    await writeFile$(toPath, `${JSON.stringify(jsonTo, null, '  ')}\n`, 'utf8');
  } catch (e) {
    return res.status(400).json({
      message: req.t('I18N_TRANSLATION_ENABLE_SAVE_TO_FILE'),
    });
  }

  return res.json(jsonTo);
};

/**
 * Remove language(s)
 * @controller Remove a/list of language(s)
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.removeLngs = async function removeLng(req, res) {
  const { ns } = req.query;
  const { backend } = req.i18n.options;

  const list = req.body.map(async (key) => {
    const path = backend.loadPath(key, ns);
    try {
      await unlink$(path);
      return true;
    } catch (e) {
      return false;
    }
  });

  await Promise.all(list);

  res.status(204).end();
};

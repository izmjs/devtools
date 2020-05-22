/* eslint-disable no-console */

const { readFile } = require('fs');
const { promisify } = require('util');
const { resolve } = require('path');
const { renderString } = require('nunjucks');
const debug = require('debug')('modules:devtools');

const readFile$ = promisify(readFile);
const SQUARE_LENGTH = 94;

function center(msg = '') {
  const spaces = ' '.repeat(parseInt((SQUARE_LENGTH - msg.length) / 2, 10));
  const text = `${spaces}${msg}${spaces}`;

  return `${text}${' '.repeat(SQUARE_LENGTH - text.length)}`;
}

module.exports = async (config) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  const { app } = config;

  const txt = await readFile$(resolve(__dirname, '../assets/hello.server.asset.txt'), {
    encoding: 'utf8',
  });


  const url = `http${app.secure.ssl ? 's' : ''}://${app.host}:${app.port}`;

  renderString(txt, {
    message: `  |${center(`URL: ${url}/devtools`)}|
  |${center(`Postman doc: ${url}${app.prefix}/devtools/postman/doc`)}|
  |${center(`Postman variables: ${url}${app.prefix}/devtools/postman/environment`)}|`,
  }).split('\n').forEach((one) => debug(one));
};

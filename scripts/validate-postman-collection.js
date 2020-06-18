#!/usr/bin/env node

const Ajv = require('ajv');
const { resolve } = require('path');
const { green } = require('chalk');

const schema = require('../schemas/collection.server.schema.json');

const ajv = new Ajv();
const validate = ajv.compile(schema);

(() => {
  const [ ,,path ] = process.argv;
  
  let data;

  if(!path) {
    console.error('Please provide a JSON file');
    return process.exit(1);
  }
  
  try {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    data = require(resolve(path));
  } catch(e) {
    // Proceed
  }
  
  if(!data) {
    console.error('Invalid JSON file');
    return process.exit(1);
  }

  if(!validate(data)) {
    console.error(validate.errors);
    return process.exit(1);
  }

  console.info(green('✓ the collection is valid'));
  return process.exit(0);
})();

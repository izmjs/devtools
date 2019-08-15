const { promisify } = require('util');
const { resolve } = require('path');
const { unlink } = require('fs');
// eslint-disable-next-line import/no-unresolved
const { addIamToRoles } = require('utils');

const unlink$ = promisify(unlink);
const cachePath = resolve(__dirname, '../.cache/postman.collection.json');

/**
 * Clean server cache
 */
module.exports = async (config) => {
  const { cleanOnBoot, addIamToGuest } = config.devtools;

  if (cleanOnBoot === true) {
    try {
      await unlink$(cachePath);
    } catch (e) {
      // Do nothing
    }
  }

  if (addIamToGuest === true) {
    try {
      await addIamToRoles('modules:devtools', ['guest', 'user']);
    } catch (e) {
      // Ignore, just proceed
    }
  }

  return true;
};

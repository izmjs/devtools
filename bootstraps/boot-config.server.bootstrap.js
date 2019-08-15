/* eslint-disable no-console */

/**
 * Clean server cache
 */
module.exports = async (config) => {
  const { env } = config.utils;
  const vars = env.toJSON();
  const { displayEnvVars } = config.devtools;

  if (!displayEnvVars) {
    return;
  }

  vars.forEach(({ name, items }) => {
    const title = `SCOPE: ${name}`;
    console.log(title);
    console.log('-'.repeat(title.length));
    const result = items.reduce((acc, v) => {
      acc[v.realKey()] = {
        name: v.name,
        key: v.realKey(),
        description: v.description,
        type: v.schema && v.schema.type
          ? v.schema.type
          : 'string',
        value: v.value,
        default: v.value.defaultValue || '',
      };
      return acc;
    }, {});
    console.table(result);
  });
};

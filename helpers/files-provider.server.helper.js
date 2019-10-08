/**
 * Gitlab file provider
 * @param {String} url The base URL
 * @param {Object} location Contains the location of the file (reference, line and column)
 * @returns {String} Formatted URL
 */
exports.gitlab = (url = '', location) => {
  const { source, line = 1 } = location;
  return `${url}/${source}#L${line}`;
};

/**
 * Github file provider
 * @param {String} url The base URL
 * @param {Object} location Contains the location of the file (reference, line and column)
 * @returns {String} Formatted URL
 */
exports.github = (url = '', location) => {
  const { source, line = 1 } = location;
  return `${url}/${source}#L${line}`;
};

/**
 * Bitbucket file provider
 * @param {String} url The base URL
 * @param {Object} location Contains the location of the file (reference, line and column)
 * @returns {String} Formatted URL
 */
exports.bitbucket = (url = '', location) => {
  const { source, line = 1 } = location;
  return `${url}/${source}#lines-${line}`;
};

/**
 * Local file provider
 * @param {String} url The base URL
 * @param {Object} location Contains the location of the file (reference, line and column)
 * @returns {String} Formatted URL
 */
exports.local = (url = 'http://localhost:3000/api/v1/devtools/files/open', location) => {
  const { source, line = 1, col = 0 } = location;
  return `${url}?file=${source}&line=${line}&col=${col}`;
};

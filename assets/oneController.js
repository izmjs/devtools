/**
 * Simple request check, just send a "true" word
 * @controller Check results
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.ok1 = (req, res) => res.json(true);

/**
 * Simple request check, just send a "true" word
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.ok = (req, res) => res.json(true);

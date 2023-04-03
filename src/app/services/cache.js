const NodeCache = require('node-cache');
let authCache = new NodeCache();
let webCache = new NodeCache();

module.exports = { authCache, webCache };
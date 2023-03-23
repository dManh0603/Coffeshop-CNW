const meRouter = require('./me');
const productsRouter = require('./product');
const siteRouter = require('./site');

function route(app) {
    // Router
    app.use('/me', meRouter);
    app.use('/products', productsRouter);
    app.use('/', siteRouter);
}

module.exports = route;
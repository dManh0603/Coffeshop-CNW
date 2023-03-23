const meRouter = require('./me');
const productsRouter = require('./produts');
const siteRouter = require('./site');

function route(app) {
    // Router
    app.use('/me', meRouter);
    app.use('/products', productsRouter);
    app.use('/', siteRouter);
}

module.exports = route;
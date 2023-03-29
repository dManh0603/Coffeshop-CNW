const meRouter = require('./me');
const productsRouter = require('./product');
const siteRouter = require('./site');
const cartRouter = require('./cart');

function route(app) {
    // Router
    app.use('/me', meRouter);
    app.use('/products', productsRouter);
    app.use('/', siteRouter);
    app.use('/cart', cartRouter);
}

module.exports = route;
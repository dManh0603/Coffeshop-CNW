const meRouter = require('./me');
const productsRouter = require('./product');
const siteRouter = require('./site');
const cartRouter = require('./cart')
const authRoute = require("./authRoute");

function route(app) {
    // Router
    app.use('/me', meRouter);
    app.use('/products', productsRouter);
    app.use("/cart", cartRouter);
    app.use('/', siteRouter);
}

module.exports = route;
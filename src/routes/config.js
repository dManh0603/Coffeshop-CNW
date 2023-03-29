const meRouter = require('./me');
const productsRouter = require('./product');
const siteRouter = require('./site');
const AuthRoute = require("./authRoute");


function route(app) {
    // Router
    app.use('/me', meRouter);
    app.use('/products', productsRouter);
    app.use('/', siteRouter);
    app.use("/", AuthRoute);
}

module.exports = route;
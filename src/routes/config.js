const meRouter = require('./MeRouter');
const productsRouter = require('./ProductRouter');
const siteRouter = require('./SiteRouter');
const cartRouter = require('./CartRouter')
const authRoute = require("./AuthRouter");

function route(app) {
    // Router
    app.use('/me', meRouter);
    app.use('/products', productsRouter);
    app.use('/', siteRouter);
    app.use('/auth/', authRoute);
}

module.exports = route;
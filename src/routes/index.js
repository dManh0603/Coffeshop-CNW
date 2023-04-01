const meRouter = require('./MeRouter');
const productsRouter = require('./ProductRouter');
const siteRouter = require('./SiteRouter');
const cartRouter = require('./CartRouter')
const authRoute = require("./AuthRouter");

function route(app) {
    // Router
    app.use('/me', meRouter);
    app.use('/products', productsRouter);
    app.use("/cart", cartRouter);
    app.use('/', siteRouter);
}

module.exports = route;
const meRouter = require('./MeRouter');
const productsRouter = require('./ProductRouter');
const siteRouter = require('./SiteRouter');
const cartRouter = require('./CartRouter')
const authRoute = require("./AuthRouter");
const authenticate = require('../app/middlewares/auth_with_cookie');

function route(app) {
    // Router
    app.use('/me', authenticate , meRouter);
    app.use('/products',authenticate, productsRouter);
    app.use("/cart", authenticate, cartRouter);
    app.use('/', siteRouter);
    app.use('/auth/', authRoute);

}

module.exports = route;
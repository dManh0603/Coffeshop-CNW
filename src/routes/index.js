const meRouter = require('./MeRouter');
const productsRouter = require('./ProductRouter');
const siteRouter = require('./SiteRouter');
const cartRouter = require('./CartRouter')
const authRouter = require("./AuthRouter");
const orderRouter = require("./OrderRouter");

const authenticate = require('../app/middlewares/auth_with_cookie');

function route(app) {
    // Router
    app.use('/me', authenticate , meRouter);
    app.use('/products',authenticate, productsRouter);
    app.use("/cart", authenticate, cartRouter);
    app.use('/orders', orderRouter);
    app.use('/auth/', authRouter);
    app.use('/', siteRouter);

}

module.exports = route;
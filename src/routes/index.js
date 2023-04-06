const meRouter = require('./MeRouter');
const productsRouter = require('./ProductRouter');
const siteRouter = require('./SiteRouter');
const cartRouter = require('./CartRouter')
const authRouter = require("./AuthRouter");
const orderRouter = require("./OrderRouter");

const {authenticate, checkAdminRole, checkUserRole} = require('../app/middlewares/auth_with_cookie');

function route(app) {

    // Router
    app.use('/me', meRouter);
    app.use('/products',checkAdminRole, productsRouter);
    app.use("/cart",checkUserRole, cartRouter);
    app.use('/orders',checkUserRole ,orderRouter);
    app.use('/auth/',authRouter);
    app.use('/', siteRouter);
}

module.exports = route;
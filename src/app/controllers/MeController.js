const Product = require('../models/Product');
const { multipleMongooseToObject, } = require('../../util/mongoose');
class MeController {
    // [GET] /me/account
    account(req, res, next) {
        res.render('me/account');
    }

    orders(req, res, next) {
        res.render('me/orders')
    }

}

module.exports = new MeController;
